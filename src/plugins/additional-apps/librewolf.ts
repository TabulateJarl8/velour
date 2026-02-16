import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'LibreWolf',
  'A privacy-focused fork of Firefox, emphasizing security and user freedom.',
  {
    dnf: 'librewolf',
    flatpak: 'io.gitlab.librewolf-community',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
    dnfPreInstall:
      'curl -fsSL https://repo.librewolf.net/librewolf.repo | pkexec tee /etc/yum.repos.d/librewolf.repo',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-librewolf': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
