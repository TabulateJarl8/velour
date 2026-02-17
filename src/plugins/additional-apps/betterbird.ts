import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-betterbird' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Betterbird',
  description: 'A fast, feature-rich email client with a focus on user experience and security.',
  progressMessage: 'Installing Betterbird...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (_config) => {
    return 'flatpak install -y eu.betterbird.Betterbird'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
