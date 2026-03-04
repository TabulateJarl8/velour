import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-google-chrome' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Google Chrome',
  description: 'The web browser from Google.',
  preRunMessage: 'Installing Google Chrome...',
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
      label: 'Choose Google Chrome installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos', 'install-dnf-plugins-core'],
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub com.google.Chrome'
    }

    return `
    if command -v dnf4 &>/dev/null; then
      dnf4 config-manager --set-enabled google-chrome
    else
      dnf config-manager setopt google-chrome.enabled=1
    fi

    dnf install -y google-chrome-stable
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
