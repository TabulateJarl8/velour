import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-zen-browser' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Zen Browser',
  description: 'A beautifully designed web browser, privacy-focused, and packed with features.',
  preRunMessage: 'Installing Zen Browser...',
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  generate: (_config) => {
    return 'flatpak install -y flathub app.zen_browser.zen'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
