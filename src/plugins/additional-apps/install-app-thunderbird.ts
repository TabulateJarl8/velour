import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-thunderbird' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Thunderbird',
  description: 'The email client from Mozilla.',
  preRunMessage: 'Installing Thunderbird...',
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
      label: 'Choose Thunderbird installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.mozilla.Thunderbird'
    }

    return 'dnf install -y thunderbird'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
