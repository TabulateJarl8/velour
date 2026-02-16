import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'wget',
  'Command-line utility for retrieving files using HTTP, HTTPS, and FTP protocols',
  { dnf: 'wget' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-wget': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
