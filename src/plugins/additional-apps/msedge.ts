import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Microsoft Edge',
  'The web browser from Microsoft.',
  {
    dnf: 'microsoft-edge-stable',
    flatpak: 'com.microsoft.Edge',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
    dnfDependencies: ['install-dnf-plugins-core'],
    dnfPreInstall: `
if command -v dnf4 &>/dev/null; then
  dnf4 config-manager --add-repo https://packages.microsoft.com/yumrepos/edge
else
  dnf config-manager addrepo --from-repofile=https://packages.microsoft.com/yumrepos/edge
fi
  `,
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-microsoft-edge': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
