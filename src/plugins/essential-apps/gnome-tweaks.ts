import { createEssentialAppPlugin } from '@/core/types'

const plugin = createEssentialAppPlugin(
  'gnome-tweaks',
  'Advanced configuration tool for customizing GNOME desktop environment settings',
  { dnf: 'gnome-tweaks' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-gnome-tweaks': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
