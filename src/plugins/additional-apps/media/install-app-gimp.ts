import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-gimp' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'GIMP',
  description:
    'A freely distributed program for such tasks as photo retouching, image composition and image authoring',
  preRunMessage: 'Installing GIMP...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose GIMP installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.gimp.GIMP'
    }

    return 'dnf install -y gimp'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
