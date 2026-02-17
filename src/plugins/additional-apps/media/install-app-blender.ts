import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-blender' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Blender',
  description: 'A free and open source 3D creation suite.',
  progressMessage: 'Installing Blender...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Blender installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.blender.Blender'
    }

    return 'dnf install -y blender'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
