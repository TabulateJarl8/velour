import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-ansible' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Ansible',
  description: 'A powerful automation tool for IT',
  preRunMessage: 'Installing Ansible...',
  options: {},
  dependencies: [],
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return 'dnf install -y ansible'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
