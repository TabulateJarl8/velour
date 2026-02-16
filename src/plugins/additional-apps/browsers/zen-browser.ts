import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Zen Browser',
  'A beautifully designed web browser, privacy-focused, and packed with features.',
  {
    flatpak: 'app.zen_browser.zen',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-zen-browser': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
