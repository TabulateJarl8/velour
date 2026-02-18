import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-flatseal' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Flatseal',
  description:
    'A graphical utility to review and modify permissions from your Flatpak applications',
  preRunMessage: 'Installing Flatseal...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub com.github.tchx84.Flatseal'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
