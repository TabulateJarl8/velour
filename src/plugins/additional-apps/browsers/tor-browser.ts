import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-tor-browser' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Tor Browser',
  description: 'Real private browsing without tracking, surveillance, or censorship',
  progressMessage: 'Installing Tor Browser...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (_config) => {
    return 'flatpak install -y org.torproject.torbrowser-launcher'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
