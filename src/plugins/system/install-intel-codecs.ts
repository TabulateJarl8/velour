import { createPlugin } from '@/core/types'

const plugin = createPlugin({
  id: 'install-intel-codecs',
  name: 'Intel Codecs',
  description:
    'Install Hardware Accelerated Codecs for Intel integrated GPUs. This improves video playback and encoding performance on systems with Intel graphics.',
  progressMessage: 'Installing Intel Hardware Accelerated Codecs...',
  options: {},
  category: 'System Configuration',
  dependencies: ['enable-rpmfusion'],
  generate: (_config) => {
    return `dnf -y install intel-media-driver`
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-intel-codecs': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
