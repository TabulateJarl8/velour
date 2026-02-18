import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-podman' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Podman',
  description: 'A tool for managing containers and pods',
  preRunMessage: 'Installing Podman...',
  options: {},
  dependencies: [],
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return 'dnf install -y podman'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
