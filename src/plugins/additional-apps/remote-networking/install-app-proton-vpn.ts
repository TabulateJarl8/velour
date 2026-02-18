import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-proton-vpn' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Proton VPN',
  description: 'A VPN client, that provides a secure and private connection to the internet',
  preRunMessage: 'Installing Proton VPN...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Remote Networking',
  generate: (_config) => {
    return 'flatpak install -y flathub com.protonvpn.www'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
