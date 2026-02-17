import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-whatsie' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Whatsie',
  description: 'Feature rich WhatsApp web client based on Qt WebEngine',
  progressMessage: 'Installing Whatsie...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (_config) => {
    return 'flatpak install -y com.ktechpit.whatsie'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
