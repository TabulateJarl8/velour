import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'unzip',
  'Extraction utility for ZIP archives with support for various compression methods',
  { dnf: 'unzip' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-unzip': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
