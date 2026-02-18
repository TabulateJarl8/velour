import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-wave-terminal' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Wave Terminal',
  description:
    'An open-source terminal with superpowers, integrating file previews, file editing, AI, web browsing, and workspace organization',
  preRunMessage: 'Installing Wave Terminal...',
  options: {},
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return `
      wget https://dl.waveterm.dev/releases-w2/waveterm-linux-x86_64-0.14.0.rpm
      dnf install -y ./waveterm-linux-x86_64-0.14.0.rpm
      rm -f ./waveterm-linux-x86_64-0.14.0.rpm
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
