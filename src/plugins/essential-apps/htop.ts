import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'htop',
  'Interactive process viewer and system monitor with a customizable interface',
  { dnf: 'htop' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-htop': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
