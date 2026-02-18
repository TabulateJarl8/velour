import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-gnome-tweaks' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'gnome-tweaks',
  description: 'Advanced configuration tool for customizing GNOME desktop environment settings',
  preRunMessage: 'Installing gnome-tweaks...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y gnome-tweaks'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
