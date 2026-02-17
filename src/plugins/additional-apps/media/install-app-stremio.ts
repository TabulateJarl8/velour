import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-stremio' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Stremio',
  description: 'A media center with a focus on privacy and security',
  progressMessage: 'Installing Stremio...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (_config) => {
    return 'flatpak install -y flathub com.stremio.Stremio'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
