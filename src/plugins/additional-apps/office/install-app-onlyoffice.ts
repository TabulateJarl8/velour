import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-onlyoffice' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'OnlyOffice',
  description:
    'Create, view and edit text documents, spreadsheets and presentations of any size and complexity',
  preRunMessage: 'Installing OnlyOffice...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Office Productivity',
  generate: (_config) => {
    return 'flatpak install -y flathub org.onlyoffice.desktopeditors'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
