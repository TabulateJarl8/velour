import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'fastfetch',
  'Quick system information tool that displays OS, kernel, uptime, and more',
  { dnf: 'fastfetch' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-fastfetch': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
