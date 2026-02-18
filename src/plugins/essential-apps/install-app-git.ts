import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-git' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'git',
  description:
    'Distributed version control system for tracking changes in source code and collaboration',
  preRunMessage: 'Installing git...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y git'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
