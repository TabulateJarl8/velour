import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-pcsx2' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'PCSX2',
  description: 'A free and open-source PlayStation 2 emulator',
  preRunMessage: 'Installing PCSX2...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (_config) => {
    return 'flatpak install -y flathub net.pcsx2.PCSX2'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
