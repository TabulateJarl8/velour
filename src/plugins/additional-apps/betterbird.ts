import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Betterbird',
  'A fast, feature-rich email client with a focus on user experience and security.',
  {
    flatpak: 'eu.betterbird.Betterbird',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-betterbird': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
