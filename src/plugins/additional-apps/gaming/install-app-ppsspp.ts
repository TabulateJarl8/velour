import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-ppsspp' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'PPSSPP',
  description: 'A PSP emulator that can run games in full HD resolution',
  preRunMessage: 'Installing PPSSPP...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (_config) => {
    return 'flatpak install -y flathub org.ppsspp.PPSSPP'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
