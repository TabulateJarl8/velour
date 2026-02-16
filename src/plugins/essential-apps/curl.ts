import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'curl',
  'Command-line tool for transferring data using various protocols with extensive options',
  { dnf: 'curl' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-curl': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
