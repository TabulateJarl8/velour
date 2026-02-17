import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-onionshare' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'OnionShare',
  description:
    'An anonymous file sharing tool that uses the Tor network to securely transfer files',
  progressMessage: 'Installing OnionShare...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'File Sharing & Downloading',
  generate: (_config) => {
    return 'flatpak install -y flathub org.onionshare.OnionShare'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
