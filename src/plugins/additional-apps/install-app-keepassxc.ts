import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-keepassxc' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'KeePassXC',
  description: 'A free, open-source, and easy-to-use password manager',
  preRunMessage: 'Installing KeePassXC...',
  options: {},
  dependencies: [],
  category: 'Additional Applications',
  heading: 'Office Productivity',
  generate: (_config) => {
    return 'dnf install -y keepassxc'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
