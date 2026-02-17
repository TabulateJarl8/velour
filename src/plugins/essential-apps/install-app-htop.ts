import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-htop' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'htop',
  description: 'Interactive process viewer and system monitor with a customizable interface',
  progressMessage: 'Installing htop...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y htop'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
