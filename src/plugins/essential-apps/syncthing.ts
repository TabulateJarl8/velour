import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'syncthing',
  'Continuous file synchronization program for sharing files between devices securely',
  { dnf: 'syncthing' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-syncthing': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
