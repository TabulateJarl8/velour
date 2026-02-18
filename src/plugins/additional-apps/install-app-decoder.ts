import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-decoder' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Decoder',
  description: 'Fancy yet simple QR Codes scanner and generator.',
  preRunMessage: 'Installing Decoder...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Office Productivity',
  generate: (_config) => {
    return 'flatpak install -y flathub com.belmoussaoui.Decoder'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
