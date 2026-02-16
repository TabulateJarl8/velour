import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'git',
  'Distributed version control system for tracking changes in source code and collaboration',
  { dnf: 'git' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-git': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
