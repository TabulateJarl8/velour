import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-tabby' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Tabby',
  description: 'A terminal for a more modern age',
  preRunMessage: 'Installing Tabby...',
  options: {},
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return `
      wget https://github.com/Eugeny/tabby/releases/download/v1.0.230/tabby-1.0.230-linux-x64.rpm
      dnf install -y ./tabby-1.0.230-linux-x64.rpm
      rm -f ./tabby-1.0.230-linux-x64.rpm
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
