import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-anydesk' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'AnyDesk',
  description:
    'Ensures secure and reliable remote desktop connections for IT professionals and on-the-go individuals alike',
  preRunMessage: 'Installing AnyDesk...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Remote Networking',
  generate: (_config) => {
    return 'flatpak install -y flathub com.anydesk.Anydesk'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
