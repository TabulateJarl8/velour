import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'ncdu',
  'NCurses-based disk usage analyzer for quickly finding large files and directories',
  { dnf: 'ncdu' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-ncdu': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
