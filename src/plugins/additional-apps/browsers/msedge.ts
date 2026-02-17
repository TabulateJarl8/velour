import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-microsoft-edge' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Microsoft Edge',
  description: 'The web browser from Microsoft.',
  progressMessage: 'Installing Microsoft Edge...',
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
      label: 'Choose Microsoft Edge installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos', 'install-dnf-plugins-core'],
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y com.microsoft.Edge'
    }

    return `
    if command -v dnf4 &>/dev/null; then
      dnf4 config-manager --add-repo https://packages.microsoft.com/yumrepos/edge
    else
      dnf config-manager addrepo --from-repofile=https://packages.microsoft.com/yumrepos/edge
    fi

    dnf install -y microsoft-edge-stable
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
