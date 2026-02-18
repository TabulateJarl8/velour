import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-logseq' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Logseq',
  description: 'A knowledge management tool with a focus on privacy and security',
  preRunMessage: 'Installing Logseq...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Office Productivity',
  generate: (_config) => {
    return 'flatpak install -y flathub com.logseq.Logseq'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
