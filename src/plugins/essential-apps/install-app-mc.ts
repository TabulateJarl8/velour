import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-mc' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'mc',
  description: 'Midnight Commander: Versatile text-based file manager with dual pane interface',
  progressMessage: 'Installing mc...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y mc'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
