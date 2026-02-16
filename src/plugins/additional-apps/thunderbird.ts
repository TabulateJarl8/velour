import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Thunderbird',
  'The email client from Mozilla.',
  {
    dnf: 'thunderbird',
    flatpak: 'org.mozilla.Thunderbird',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-thunderbird': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
