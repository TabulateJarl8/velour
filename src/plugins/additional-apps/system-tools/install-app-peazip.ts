import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-peazip' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'PeaZip',
  description:
    'A free file archiver utility, based on Open Source technologies of 7-Zip, p7zip, Brotli, FreeArc, PAQ, Zstandard, and PEA projects',
  progressMessage: 'Installing PeaZip...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub io.github.peazip.PeaZip'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
