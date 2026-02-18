import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-remmina' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Remmina',
  description:
    'A remote-desktop client written in GTK, to use other desktops remotely, from a tiny screen or large monitors',
  preRunMessage: 'Installing Remmina...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Remmina installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Remote Networking',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.remmina.Remmina'
    }

    return 'dnf install -y remmina'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
