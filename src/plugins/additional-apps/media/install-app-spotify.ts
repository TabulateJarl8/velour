import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-spotify' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Spotify',
  description: 'A music streaming service with a focus on privacy and security',
  progressMessage: 'Installing Spotify...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (_config) => {
    return 'flatpak install -y flathub com.spotify.Client'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
