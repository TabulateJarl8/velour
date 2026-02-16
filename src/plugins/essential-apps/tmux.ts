import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'tmux',
  'Terminal multiplexer for creating multiple terminal sessions within a single window',
  { dnf: 'tmux' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-tmux': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
