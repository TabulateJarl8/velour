import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'rsync',
  'Fast and versatile file copying tool for local and remote file synchronization',
  { dnf: 'rsync' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-rsync': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
