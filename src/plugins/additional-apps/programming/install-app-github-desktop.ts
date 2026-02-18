import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-github-desktop' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'GitHub Desktop',
  description: 'A powerful desktop client for GitHub',
  preRunMessage: 'Installing GitHub Desktop...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return 'flatpak install -y flathub io.github.shiftey.Desktop'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
