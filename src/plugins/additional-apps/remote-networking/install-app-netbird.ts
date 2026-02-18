import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-netbird' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'NetBird',
  description:
    'NetBird is an open-source mesh VPN that simplifies secure, peer-to-peer networking using WireGuard and Zero Trust principles.',
  preRunMessage: 'Installing NetBird...',
  options: {},
  category: 'Additional Applications',
  heading: 'Remote Networking',
  generate: (_config) => {
    return 'curl -fsSL https://pkgs.netbird.io/install.sh | sh'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
