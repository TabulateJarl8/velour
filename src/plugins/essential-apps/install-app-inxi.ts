import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-inxi' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'inxi',
  description: 'Command-line system information tool for hardware, CPU, drivers, and more',
  progressMessage: 'Installing inxi...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y inxi'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
