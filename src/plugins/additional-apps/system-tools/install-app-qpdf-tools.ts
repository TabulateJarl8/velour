import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-qpdf-tools' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Qpdf Tools',
  description: 'A Qt interface for Ghostscript and QPDF',
  preRunMessage: 'Installing Qpdf Tools...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub br.eng.silas.qpdftools'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
