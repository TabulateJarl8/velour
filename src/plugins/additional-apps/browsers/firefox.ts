import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-firefox' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Firefox',
  description: 'Fast, private & safe web browser.',
  progressMessage: 'Installing Firefox...',
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
      label: 'Choose Firefox installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y org.mozilla.firefox'
    }

    return 'dnf install -y firefox'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
