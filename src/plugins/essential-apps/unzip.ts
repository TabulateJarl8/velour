import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'unzip',
  'Extraction utility for ZIP archives with support for various compression methods',
  { dnf: 'unzip' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-unzip': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
