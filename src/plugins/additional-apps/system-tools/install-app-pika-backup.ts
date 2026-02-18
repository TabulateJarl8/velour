import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-pika-backup' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Pika Backup',
  description: 'A simple backup tool for Linux',
  progressMessage: 'Installing Pika Backup...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'System Tools',
  generate: (_config) => {
    return 'flatpak install -y flathub org.gnome.World.PikaBackup'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
