import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-virtualization-tools' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Virtualization Tools',
  description: 'Install virtualization tools to enable virtual machines and containerization',
  preRunMessage: 'Installing virtualization tools...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => 'dnf install -y @virtualization',
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
