import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-curl' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'curl',
  description:
    'Command-line tool for transferring data using various protocols with extensive options',
  progressMessage: 'Installing curl...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y curl'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
