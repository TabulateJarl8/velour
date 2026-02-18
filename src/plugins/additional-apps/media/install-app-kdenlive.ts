import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-kdenlive' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Kdenlive',
  description: 'A video editing application with support for many audio and video formats',
  preRunMessage: 'Installing Kdenlive...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Kdenlive installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.kde.kdenlive'
    }

    return 'dnf install -y kdenlive'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
