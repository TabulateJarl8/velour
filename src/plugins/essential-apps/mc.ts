import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'mc',
  'Midnight Commander: Versatile text-based file manager with dual pane interface',
  { dnf: 'mc' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-mc': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
