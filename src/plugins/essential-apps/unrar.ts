import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'unrar',
  'Extraction utility for RAR archives, including support for password-protected files',
  { dnf: 'unrar' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-unrar': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
