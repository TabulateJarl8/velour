import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Google Chrome',
  'The web browser from Google.',
  {
    dnf: 'google-chrome-stable',
    flatpak: 'com.google.Chrome',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
    dnfPreInstall: `
if command -v dnf4 &>/dev/null; then
  dnf4 config-manager --set-enabled google-chrome
else
  dnf config-manager setopt google-chrome.enabled=1
fi
  `,
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-google-chrome': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
