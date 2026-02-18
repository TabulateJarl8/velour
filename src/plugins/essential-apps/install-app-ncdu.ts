import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-ncdu' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'ncdu',
  description: 'NCurses-based disk usage analyzer for quickly finding large files and directories',
  preRunMessage: 'Installing ncdu...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y ncdu'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
