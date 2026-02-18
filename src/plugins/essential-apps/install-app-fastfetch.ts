import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-fastfetch' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'fastfetch',
  description: 'Quick system information tool that displays OS, kernel, uptime, and more',
  preRunMessage: 'Installing fastfetch...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y fastfetch'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
