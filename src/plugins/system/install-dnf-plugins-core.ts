import { createPlugin } from '@/core/types'

const plugin = createPlugin({
  id: 'install-dnf-plugins-core',
  name: 'Install DNF Plugins',
  description: 'Install various DNF plugins',
  progressMessage: 'Installing dnf-plugins-core...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => ({
    systemPackages: ['dnf-plugins-core'],
  }),
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-dnf-plugins-core': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
