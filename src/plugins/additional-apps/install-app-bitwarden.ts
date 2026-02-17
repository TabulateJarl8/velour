import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-bitwarden' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Bitwarden',
  description: 'A secure and free password manager for all of your devices',
  progressMessage: 'Installing Bitwarden...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Office Productivity',
  generate: (_config) => {
    return 'flatpak install -y flathub com.bitwarden.desktop'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
