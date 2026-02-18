import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-protonup-qt' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'ProtonUp-Qt',
  description:
    'Install and manage Wine- and Proton-based compatibility tools for Steam and Lutris with this graphical user interface',
  progressMessage: 'Installing ProtonUp-Qt...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub net.davidotek.pupgui2'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
