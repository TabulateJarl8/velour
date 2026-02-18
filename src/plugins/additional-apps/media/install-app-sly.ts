import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-sly' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Sly',
  description:
    'A friendly image editor that requires no internet connection or preexisting expertise',
  preRunMessage: 'Installing Sly...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (_config) => {
    return 'flatpak install -y flathub page.kramo.Sly'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
