import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'git',
  'Distributed version control system for tracking changes in source code and collaboration',
  { dnf: 'git' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-git': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
