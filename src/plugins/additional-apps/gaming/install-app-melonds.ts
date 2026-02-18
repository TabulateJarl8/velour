import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-melonds' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'melonDS',
  description: 'Aims at providing fast and accurate Nintendo DS emulation',
  progressMessage: 'Installing melonDS...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (_config) => {
    return 'flatpak install -y flathub net.kuribo64.melonDS'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
