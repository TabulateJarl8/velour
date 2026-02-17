import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-intel-codecs' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Intel Codecs',
  description:
    'Install Hardware Accelerated Codecs for Intel integrated GPUs. This improves video playback and encoding performance on systems with Intel graphics.',
  progressMessage: 'Installing Intel Hardware Accelerated Codecs...',
  options: {},
  category: 'System Configuration',
  dependencies: ['enable-rpmfusion'],
  generate: (_config) => 'dnf install -y intel-media-driver',
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
