import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-mullvad-vpn' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Mullvad VPN',
  description: 'A VPN client, that provides a secure and private connection to the internet',
  preRunMessage: 'Installing Mullvad VPN...',
  options: {},
  category: 'Additional Applications',
  heading: 'Remote Networking',
  dependencies: ['install-dnf-plugins-core'],
  generate: (_config) => {
    return `
if command -v dnf4 &>/dev/null; then
  dnf4 config-manager --add-repo https://repository.mullvad.net/rpm/stable/mullvad.repo
else
  dnf config-manager addrepo --from-repofile=https://repository.mullvad.net/rpm/stable/mullvad.repo
fi
dnf install -y mullvad-vpn
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
