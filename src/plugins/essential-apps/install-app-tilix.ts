import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-tilix' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'tilix',
  description:
    'Tiling terminal emulator with advanced features like split panes and session management',
  progressMessage: 'Installing tilix...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y tilix'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
