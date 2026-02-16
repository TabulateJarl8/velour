import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'mc',
  'Midnight Commander: Versatile text-based file manager with dual pane interface',
  { dnf: 'mc' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-mc': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
