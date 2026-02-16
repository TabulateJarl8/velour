import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Discord',
  'A popular communication platform for gamers and communities',
  {
    dnf: 'discord',
    flatpak: 'com.discordapp.Discord',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
    dnfDependencies: ['enable-rpmfusion'],
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-discord': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
