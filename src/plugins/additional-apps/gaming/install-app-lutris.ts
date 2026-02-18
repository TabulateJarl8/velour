import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-lutris' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Lutris',
  description: 'Helps you install and play video games from all eras and from most gaming systems',
  preRunMessage: 'Installing Lutris...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Lutris installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub net.lutris.Lutris'
    }

    return 'dnf install -y lutris'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
