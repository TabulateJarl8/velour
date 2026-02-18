import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-webappmanager' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'WebAppManager',
  description: 'Run websites as if they were apps.',
  preRunMessage: 'Installing WebAppManager...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {},
  dependencies: [],
  generate: (_config) => {
    return `
    dnf copr enable risi/risiOS -y
    echo 'includepkgs=webapp-manager' | sudo tee -a /etc/yum.repos.d/_copr:copr.fedorainfracloud.org:risi:risiOS.repo

    dnf install -y webapp-manager
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
