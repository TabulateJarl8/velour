import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-signal-desktop' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Signal Desktop',
  description: 'A private messaging app with end-to-end encryption',
  progressMessage: 'Installing Signal Desktop...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (_config) => {
    return 'flatpak install -y flathub org.signal.Signal'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
