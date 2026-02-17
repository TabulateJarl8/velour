import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-joplin' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Joplin',
  description: 'A note-taking app with a focus on privacy and security',
  progressMessage: 'Installing Joplin...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Office Productivity',
  generate: (_config) => {
    return 'flatpak install -y flathub net.cozic.joplin_desktop'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
