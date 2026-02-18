import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'adobe-fonts' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Adobe Fonts',
  description: 'Install Adobe fonts collection',
  progressMessage: 'Installing Adobe Fonts...',
  options: {},
  category: 'Customization',

  generate: (_config) => {
    return `
      mkdir -p "$ACTUAL_HOME/.local/share/fonts/adobe-fonts"
      git clone --depth 1 https://github.com/adobe-fonts/source-sans.git "$ACTUAL_HOME/.local/share/fonts/adobe-fonts/source-sans"
      git clone --depth 1 https://github.com/adobe-fonts/source-serif.git "$ACTUAL_HOME/.local/share/fonts/adobe-fonts/source-serif"
      git clone --depth 1 https://github.com/adobe-fonts/source-code-pro.git "$ACTUAL_HOME/.local/share/fonts/adobe-fonts/source-code-pro"
      fc-cache -f
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
