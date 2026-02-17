import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-dnf-plugins-core' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Install DNF Plugins',
  description: 'Install various DNF plugins',
  progressMessage: 'Installing dnf-plugins-core...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => 'dnf install -y dnf-plugins-core',
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
