import { createPlugin } from '@/core/types'

const plugin = createPlugin({
  id: 'install-ssh',
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
    'install-ssh': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
