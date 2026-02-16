import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'htop',
  'Interactive process viewer and system monitor with a customizable interface',
  { dnf: 'htop' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-htop': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
