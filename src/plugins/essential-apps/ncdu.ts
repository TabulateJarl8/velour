import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'ncdu',
  'NCurses-based disk usage analyzer for quickly finding large files and directories',
  { dnf: 'ncdu' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-ncdu': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
