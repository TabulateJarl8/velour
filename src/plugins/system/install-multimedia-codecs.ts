import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-multimedai-codecs' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Multimedia Codecs',
  description: 'Install multimedia codecs to enhance multimedia capabilities',
  preRunMessage: 'Installing multimedia codecs...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => {
    return `
      dnf swap ffmpeg-free ffmpeg --allowerasing -y
      dnf update @multimedia --setopt="install_weak_deps=False" --exclude=PackageKit-gstreamer-plugin -y
      dnf group install -y sound-and-video
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
