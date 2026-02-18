import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-nomachine' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'NoMachine',
  description:
    'A remote desktop software, that enables fast and secure access to your remote PC or desktop computer',
  progressMessage: 'Installing NoMachine...',
  options: {},
  category: 'Additional Applications',
  heading: 'Remote Networking',
  generate: (_config) => {
    return `
wget https://web9001.nomachine.com/download/9.3/Linux/nomachine_9.3.7_1_x86_64.rpm
dnf install -y ./nomachine_9.3.7_1_x86_64.rpm
rm -f ./nomachine_9.1.24_6_x86_64.rpm
`
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
