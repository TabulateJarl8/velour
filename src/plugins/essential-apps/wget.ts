import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'wget',
  'Command-line utility for retrieving files using HTTP, HTTPS, and FTP protocols',
  { dnf: 'wget' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-wget': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
