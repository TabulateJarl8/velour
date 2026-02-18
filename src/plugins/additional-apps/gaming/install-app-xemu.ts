import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-xemu' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'xemu',
  description:
    'A free and open-source application that emulates the original Microsoft Xbox game console',
  preRunMessage: 'Installing xemu...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (_config) => {
    return 'flatpak install -y flathub app.xemu.xemu'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
