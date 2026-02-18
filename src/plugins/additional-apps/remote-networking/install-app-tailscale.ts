import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-tailscale' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Tailscale',
  description:
    'Tailscale is a mesh VPN (Virtual Private Network) service that streamlines connecting devices and services securely across different networks',
  preRunMessage: 'Installing Tailscale...',
  options: {},
  category: 'Additional Applications',
  heading: 'Remote Networking',
  dependencies: ['install-dnf-plugins-core'],
  generate: (_config) => {
    return `
dnf config-manager addrepo --from-repofile=https://pkgs.tailscale.com/stable/fedora/tailscale.repo
dnf install tailscale -y
systemctl enable --now tailscaled
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
