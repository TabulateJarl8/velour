import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-veracrypt' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'VeraCrypt',
  description: 'A free and open-source encryption software',
  preRunMessage: 'Installing VeraCrypt...',
  options: {},
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return `
      wget https://launchpad.net/veracrypt/trunk/1.26.24/+download/veracrypt-1.26.24-Fedora-40-x86_64.rpm
      dnf install -y ./veracrypt-1.26.24-Fedora-40-x86_64.rpm
      rm -f ./veracrypt-1.26.24-Fedora-40-x86_64.rpm
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
