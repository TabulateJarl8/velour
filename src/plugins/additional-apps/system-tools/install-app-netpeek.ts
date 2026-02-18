import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-netpeek' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'NetPeek',
  description:
    'A simple network scanner that helps you discover active devices on your local network',
  preRunMessage: 'Installing NetPeek...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub io.github.zingytomato.netpeek'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
