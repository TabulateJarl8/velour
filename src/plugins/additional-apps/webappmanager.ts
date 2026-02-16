import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'WebAppManager',
  'Run websites as if they were apps.',
  {
    dnf: 'webapp-manager',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
    dnfPreInstall: `
    dnf copr enable risi/risiOS -y
    echo 'includepkgs=webapp-manager' | sudo tee -a /etc/yum.repos.d/_copr:copr.fedorainfracloud.org:risi:risiOS.repo
    `,
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-webappmanager': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
