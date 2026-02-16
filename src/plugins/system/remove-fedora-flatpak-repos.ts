import { createPlugin } from '@/core/types'

const plugin = createPlugin({
  id: 'remove-fedora-flatpak-repos',
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
      flatpak update
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'remove-fedora-flatpak-repos': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
