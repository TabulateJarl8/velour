import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-obs-studio' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'OBS Studio',
  description: 'Free and open source software for video capturing, recording, and live streaming.',
  progressMessage: 'Installing OBS Studio...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose OBS Studio installation type:',
    },
  },
  dependencies: ['enable-rpmfusion', 'remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub com.obsproject.Studio'
    }

    return 'dnf install -y obs-studio'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
