import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-librewolf' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'LibreWolf',
  description: 'A privacy-focused fork of Firefox, emphasizing security and user freedom.',
  progressMessage: 'Installing LibreWolf...',
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
      label: 'Choose LibreWolf installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub io.gitlab.librewolf-community'
    }

    return `
      curl -fsSL https://repo.librewolf.net/librewolf.repo | pkexec tee /etc/yum.repos.d/librewolf.repo
      dnf install -y librewolf
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
