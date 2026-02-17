import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-warp' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Warp',
  description: 'Securely send files via the internet or local network by exchanging a word-based code',
  progressMessage: 'Installing Warp...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'File Sharing & Downloading',
  generate: (_config) => {
    return 'flatpak install -y flathub app.drey.Warp'
  }
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}