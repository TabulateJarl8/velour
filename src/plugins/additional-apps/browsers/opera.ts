import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Opera',
  'A fast, feature-rich web browser with a focus on user experience and security.',
  {
    flatpak: 'com.opera.Opera',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-opera': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
