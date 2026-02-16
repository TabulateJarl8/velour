import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Firefox',
  'Fast, private & safe web browser.',
  {
    dnf: 'firefox',
    flatpak: 'org.mozilla.firefox',
  },
  { category: 'Additional Applications', heading: 'Internet & Communication' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-firefox': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
