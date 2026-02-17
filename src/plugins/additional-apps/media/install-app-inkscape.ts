import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-inkscape' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Inkscape',
  description: 'A Free and open source vector graphics editor',
  progressMessage: 'Installing Inkscape...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Inkscape installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.inkscape.Inkscape'
    }

    return 'dnf install -y inkscape'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
