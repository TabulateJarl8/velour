import { createAppPlugin } from '@/core/types'

const plugin = createAppPlugin(
  'Chromium',
  'An open-source browser project that aims to build a safer, faster, and more stable way to experience the web.',
  {
    dnf: 'chromium',
    flatpak: 'org.chromium.Chromium',
  },
  {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
  },
)

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'install-app-chromium': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
