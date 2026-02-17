import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-wps-office' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'WPS Office',
  description:
    'A powerful office suite, which is able to process word file, produce wonderful slides, and analyze data as well',
  progressMessage: 'Installing WPS Office...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Office Productivity',
  generate: (_config) => {
    return 'flatpak install -y flathub com.wps.Office'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
