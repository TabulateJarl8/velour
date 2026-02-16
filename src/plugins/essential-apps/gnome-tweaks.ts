import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'gnome-tweaks',
  'Advanced configuration tool for customizing GNOME desktop environment settings',
  { dnf: 'gnome-tweaks' },
  { category: 'Essential Applications' },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-gnome-tweaks': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
