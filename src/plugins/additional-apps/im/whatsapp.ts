import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Whatsie',
  'Feature rich WhatsApp web client based on Qt WebEngine',
  {
    flatpak: 'com.ktechpit.whatsie',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-whatsie': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
