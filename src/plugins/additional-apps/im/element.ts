import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Element',
  'A secure, open-source Matrix client',
  {
    flatpak: 'im.riot.Riot',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-element': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
