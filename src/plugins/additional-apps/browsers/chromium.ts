import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-chromium' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Chromium',
  description:
    'An open-source browser project that aims to build a safer, faster, and more stable way to experience the web.',
  progressMessage: 'Installing Chromium...',
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
      label: 'Choose Chromium installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y org.chromium.Chromium'
    }

    return 'dnf install -y chromium'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
