import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-telegram-desktop' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Telegram Desktop',
  description: 'A messaging app with a focus on speed and security',
  progressMessage: 'Installing Telegram Desktop...',
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
      label: 'Choose Telegram Desktop installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y org.telegram.desktop'
    }

    return 'dnf install -y telegram-desktop'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
