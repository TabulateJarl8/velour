import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-heroic-games-launcher' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Heroic Games Launcher',
  description: 'A free and open source games launcher for Epic Games, GOG, and Amazon.',
  progressMessage: 'Installing Heroic Games Launcher...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (_config) => {
    return 'flatpak install -y flathub com.heroicgameslauncher.hgl'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
