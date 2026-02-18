import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-rsync' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'rsync',
  description: 'Fast and versatile file copying tool for local and remote file synchronization',
  preRunMessage: 'Installing rsync...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y rsync'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
