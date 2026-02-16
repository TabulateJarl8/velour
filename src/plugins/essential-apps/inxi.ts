import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'inxi',
  'Command-line system information tool for hardware, CPU, drivers, and more',
  { dnf: 'inxi' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-inxi': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
