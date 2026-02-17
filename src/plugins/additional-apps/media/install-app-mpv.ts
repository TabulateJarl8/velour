import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-mpv' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'MPV',
  description:
    'A free, open source, and cross-platform media player with a minimal GUI and advanced features',
  progressMessage: 'Installing MPV...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose MPV installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Media & Graphics',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return 'flatpak install -y flathub io.mpv.Mpv'
    }

    return 'dnf install -y mpv'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
