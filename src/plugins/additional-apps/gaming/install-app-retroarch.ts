import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-retroarch' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'RetroArch',
  description: 'Enables you to run classic games on a wide range of computers and consoles',
  progressMessage: 'Installing RetroArch...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose RetroArch installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.libretro.RetroArch'
    }

    return 'dnf install -y retroarch'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
