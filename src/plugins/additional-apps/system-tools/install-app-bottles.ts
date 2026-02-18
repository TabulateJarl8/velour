import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-bottles' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Bottles',
  description: 'Lets you run Windows software on Linux, such as applications and games.',
  progressMessage: 'Installing Bottles...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub com.usebottles.bottles'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
