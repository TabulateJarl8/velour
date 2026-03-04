import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-discord' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Discord',
  description: 'A popular communication platform for gamers and communities',
  preRunMessage: 'Installing Discord...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Discord installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos', 'enable-rpmfusion'],
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub com.discordapp.Discord'
    }

    return 'dnf install -y discord'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
