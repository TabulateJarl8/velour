import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-amd-codecs' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'AMD Codecs',
  description:
    'Install Hardware Accelerated Codecs for AMD GPUs. This improves video playback and encoding performance on systems with AMD graphics.',
  progressMessage: 'Installing AMD Hardware Accelerated Codecs...',
  options: {},
  category: 'System Configuration',
  dependencies: ['enable-rpmfusion'],
  generate: (_config) => {
    return `
      dnf swap mesa-va-drivers mesa-va-drivers-freeworld -y
      dnf swap mesa-vdpau-drivers mesa-vdpau-drivers-freeworld -y
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
