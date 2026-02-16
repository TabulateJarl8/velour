import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Telegram Desktop',
  'A messaging app with a focus on speed and security',
  {
    dnf: 'telegram-desktop',
    flatpak: 'org.telegram.desktop',
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
    'install-app-telegram-desktop': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
