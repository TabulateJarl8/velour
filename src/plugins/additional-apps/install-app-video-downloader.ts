import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-video-downloader' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Video Downloader',
  description: 'Download videos from websites with an easy-to-use interface',
  progressMessage: 'Installing Video Downloader...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'File Sharing & Downloading',
  generate: (_config) => {
    return 'flatpak install -y flathub com.github.unrud.VideoDownloader'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
