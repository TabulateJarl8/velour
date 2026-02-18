import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-opera' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Opera',
  description: 'A fast, feature-rich web browser with a focus on user experience and security.',
  preRunMessage: 'Installing Opera...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (_config) => {
    return 'flatpak install -y flathub com.opera.Opera'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
