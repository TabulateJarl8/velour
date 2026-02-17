import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-simplex' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'SimpleX',
  description: 'A secure, private messaging app with end-to-end encryption',
  progressMessage: 'Installing SimpleX...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (_config) => {
    return 'flatpak install -y chat.simplex.simplex'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
