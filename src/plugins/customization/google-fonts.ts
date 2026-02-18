import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'google-fonts' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Google Fonts',
  description: 'Install Google fonts collection',
  progressMessage: 'Installing Google Fonts...',
  options: {},
  category: 'Customization',

  generate: (_config) => {
    return `
      wget -O /tmp/google-fonts.zip https://github.com/google/fonts/archive/main.zip
      mkdir -p "$ACTUAL_HOME/.local/share/fonts/google"
      unzip /tmp/google-fonts.zip -d "$ACTUAL_HOME/.local/share/fonts/google"
      rm -f /tmp/google-fonts.zip
      fc-cache -fv
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
