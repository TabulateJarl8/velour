import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-syncthing' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'syncthing',
  description: 'Continuous file synchronization program for sharing files between devices securely',
  preRunMessage: 'Installing syncthing...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y syncthing'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
