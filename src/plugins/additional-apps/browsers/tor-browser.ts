import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Tor Browser',
  'Real private browsing without tracking, surveillance, or censorship',
  {
    flatpak: 'org.torproject.torbrowser-launcher',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-tor-browser': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
