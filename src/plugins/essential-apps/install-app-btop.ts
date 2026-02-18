import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-btop' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'btop',
  description:
    'Resource monitor that shows usage and stats for processor, memory, disks, network and processes',
  preRunMessage: 'Installing btop...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y btop'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
