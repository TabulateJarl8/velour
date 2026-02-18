import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-tmux' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'tmux',
  description:
    'Terminal multiplexer for creating multiple terminal sessions within a single window',
  preRunMessage: 'Installing tmux...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y tmux'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
