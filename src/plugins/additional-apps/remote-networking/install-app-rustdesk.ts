import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-rustdesk' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'RustDesk',
  description:
    'A remote desktop software, that enables fast and secure access to your remote PC or desktop computer',
  preRunMessage: 'Installing RustDesk...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Remote Networking',
  generate: (_config) => {
    return 'flatpak install -y flathub com.rustdesk.RustDesk'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
