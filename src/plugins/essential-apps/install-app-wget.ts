import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-wget' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'wget',
  description: 'Command-line utility for retrieving files using HTTP, HTTPS, and FTP protocols',
  progressMessage: 'Installing wget...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y wget'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
