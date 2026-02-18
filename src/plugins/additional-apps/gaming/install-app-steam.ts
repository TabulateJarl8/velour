import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-steam' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Steam',
  description:
    'A software distribution service with an online store, automated installation, automatic updates, achievements, SteamCloud synchronized savegame and screenshot functionality, and many social features',
  progressMessage: 'Installing Steam...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Steam installation type:',
    },
  },
  dependencies: ['enable-rpmfusion', 'remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub com.valvesoftware.Steam'
    }

    return 'dnf install -y steam'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
