import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-brave' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Brave',
  description: 'Privacy-focused web browser.',
  progressMessage: 'Installing Brave...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose Brave installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos', 'install-dnf-plugins-core'],
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub com.brave.Browser'
    }

    return `
    if command -v dnf4 &>/dev/null; then
      dnf4 config-manager --add-repo https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo
    else
      dnf config-manager --add-repo https://brave-browser-rpm-release.s3.brave.com/brave-browser.repo
    fi
    rpm --import https://brave-browser-rpm-release.s3.brave.com/brave-core.asc

    dnf install -y brave-browser
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
