import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'tmux',
  'Terminal multiplexer for creating multiple terminal sessions within a single window',
  { dnf: 'tmux' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-tmux': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
