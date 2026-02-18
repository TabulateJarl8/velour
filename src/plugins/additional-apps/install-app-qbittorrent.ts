import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-qbittorrent' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'qBittorrent',
  description: 'Aims to provide an open-source software alternative to µTorrent.',
  preRunMessage: 'Installing qBittorrent...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose qBittorrent installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'File Sharing & Downloading',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub org.qbittorrent.qBittorrent'
    }

    return 'dnf install -y qbittorrent'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
