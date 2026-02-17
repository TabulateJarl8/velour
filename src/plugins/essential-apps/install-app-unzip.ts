import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-unzip' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'unzip',
  description: 'Extraction utility for ZIP archives with support for various compression methods',
  progressMessage: 'Installing unzip...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y unzip'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
