import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-dolphin-emulator' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Dolphin',
  description: 'An emulator for two recent Nintendo video game consoles: the GameCube and the Wii',
  preRunMessage: 'Installing Dolphin...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (_config) => {
    return 'flatpak install -y flathub org.DolphinEmu.dolphin-emu'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
