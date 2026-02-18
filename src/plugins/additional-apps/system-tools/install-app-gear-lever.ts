import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-gear-lever' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Gear Lever',
  description: 'An utility to manage AppImages with ease!',
  preRunMessage: 'Installing Gear Lever...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub it.mijorus.gearlever'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
