import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-element' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Element',
  description: 'A secure, open-source Matrix client',
  progressMessage: 'Installing Element...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (_config) => {
    return 'flatpak install -y flathub im.riot.Riot'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
