import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-dialect' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Dialect',
  description: 'A translation app for GNOME supporting multiple services',
  progressMessage: 'Installing Dialect...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Dialect installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Office Productivity',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub app.drey.Dialect'
    }

    return 'dnf install -y dialect'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
