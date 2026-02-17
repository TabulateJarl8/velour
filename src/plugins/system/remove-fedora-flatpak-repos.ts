import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'remove-fedora-flatpak-repos' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Replace Fedora Flatpak Repo with Flathub',
  description:
    'Replace Fedora Flatpak Repo with Flathub for better package management and apps stability',
  progressMessage: 'Replacing Fedora Flatpak Repo with Flathub...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => {
    return `
      dnf install -y flatpak
      flatpak remote-delete fedora --force || true
      flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
      flatpak repair
      flatpak update -v
      flatpak install -y flathub
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
