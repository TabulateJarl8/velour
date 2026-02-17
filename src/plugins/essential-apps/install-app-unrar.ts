import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-unrar' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'unrar',
  description:
    'Extraction utility for RAR archives, including support for password-protected files',
  progressMessage: 'Installing unrar...',
  category: 'Essential Applications',

  options: {},
  dependencies: [],
  generate: (_config) => {
    return 'dnf install -y unrar'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
