import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'unrar',
  'Extraction utility for RAR archives, including support for password-protected files',
  { dnf: 'unrar' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-unrar': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
