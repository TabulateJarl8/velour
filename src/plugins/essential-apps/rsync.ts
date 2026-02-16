import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'rsync',
  'Fast and versatile file copying tool for local and remote file synchronization',
  { dnf: 'rsync' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-rsync': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
