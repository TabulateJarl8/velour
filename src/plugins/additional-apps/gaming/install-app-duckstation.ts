import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-duckstation' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'DuckStation',
  description: 'An simulator/emulator of the Sony PlayStation(TM) console',
  progressMessage: 'Installing DuckStation...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Gaming & Emulation',
  generate: (_config) => {
    return 'flatpak install -y flathub org.duckstation.DuckStation'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
