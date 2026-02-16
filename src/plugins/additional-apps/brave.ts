import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Brave',
  'Privacy-focused web browser.',
  {
    dnf: 'brave-browser',
    flatpak: 'com.brave.Browser',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
    dependencies: ['install-dnf-plugins-core'],
    dnfPreInstall: `
    if command -v dnf4 &>/dev/null; then
      dnf4 config-manager --add-repo https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo
    else
      dnf config-manager --add-repo https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo
    fi
    rpm --import https://brave-browser-rpm-release.s3.brave.com/brave-core.asc
    `,
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-brave': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
