import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-freetube' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'FreeTube',
  description: 'An open source desktop YouTube player built with privacy in mind.',
  progressMessage: 'Installing FreeTube...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (_config) => {
    return 'flatpak install -y flathub io.freetubeapp.FreeTube'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
