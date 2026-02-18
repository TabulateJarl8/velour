import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-zerotier' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'ZeroTier',
  description:
    'A secure network overlay that allows you to manage all of your network resources as if they were on the same LAN',
  progressMessage: 'Installing ZeroTier...',
  options: {},
  category: 'Additional Applications',
  heading: 'Remote Networking',
  generate: (_config) => {
    return "curl -s 'https://raw.githubusercontent.com/zerotier/ZeroTierOne/main/doc/contact%40zerotier.com.gpg' | gpg --import && if z=$(curl -s 'https://install.zerotier.com/' | gpg); then echo \"$z\" | sudo bash; fi"
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
