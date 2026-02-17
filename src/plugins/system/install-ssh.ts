import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-ssh' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Install and Enable SSH Server',
  description: 'Install and enable SSH server for secure remote access and file transfers',
  progressMessage: 'Installing and enabling SSH server...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => {
    return `
    dnf install -y openssh-server
    systemctl enable --now sshd
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
