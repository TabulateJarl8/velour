import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'btop',
  'Resource monitor that shows usage and stats for processor, memory, disks, network and processes',
  { dnf: 'btop' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-btop': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
