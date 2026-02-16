import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'SimpleX',
  'A secure, private messaging app with end-to-end encryption',
  {
    flatpak: 'chat.simplex.simplex',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-simplex': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
