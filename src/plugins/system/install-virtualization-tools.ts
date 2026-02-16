import { createPlugin } from '@/core/types'

const plugin = createPlugin({
  id: 'install-virtualization-tools',
  name: 'Virtualization Tools',
  description: 'Install virtualization tools to enable virtual machines and containerization',
  progressMessage: 'Installing virtualization tools...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => {
    return `dnf install -y @virtualization`
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-virtualization-tools': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
