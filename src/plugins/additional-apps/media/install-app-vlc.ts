import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-vlc' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'VLC',
  description: 'A media player with a focus on privacy and security',
  progressMessage: 'Installing VLC...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose VLC installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.videolan.VLC'
    }

    return 'dnf install -y vlc'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
