import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-deja-dup' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Deja Dup',
  description: 'A GNOME archive manager',
  preRunMessage: 'Installing Deja Dup...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub org.gnome.DejaDup'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
