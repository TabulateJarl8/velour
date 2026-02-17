import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-krita' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Krita',
  description: 'A full-featured digital art studio.',
  progressMessage: 'Installing Krita...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Krita installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.kde.krita'
    }

    return 'dnf install -y krita'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
