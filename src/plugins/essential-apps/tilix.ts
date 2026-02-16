import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'tilix',
  'Tiling terminal emulator with advanced features like split panes and session management',
  { dnf: 'tilix' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-tilix': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
