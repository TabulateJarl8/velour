import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Signal Desktop',
  'A private messaging app with end-to-end encryption',
  {
    flatpak: 'org.signal.Signal',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-signal-desktop': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
