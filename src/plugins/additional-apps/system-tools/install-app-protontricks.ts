import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-protontricks' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Protontricks',
  description:
    'A wrapper script that allows you to easily run Winetricks commands for Steam Play/Proton games',
  progressMessage: 'Installing Protontricks...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub com.github.Matoking.protontricks'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
