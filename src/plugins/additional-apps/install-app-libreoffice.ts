import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-libreoffice' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'LibreOffice',
  description:
    'A powerful office suite. Its clean interface and feature-rich tools help you unleash your creativity and enhance your productivity',
  progressMessage: 'Installing LibreOffice...',
  options: {
    source: {
      type: 'radio',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
      default: 'dnf',
      label: 'Choose LibreOffice installation type:',
    },
  },
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Office Productivity',
  generate: (config) => {
    if (config.source === 'flatpak') {
      return `
      flatpak install -y flathub org.libreoffice.LibreOffice
      flatpak install -y flathub --reinstall org.freedesktop.Platform.Locale/x86_64/24.08
      flatpak install -y flathub --reinstall org.libreoffice.LibreOffice.Locale
      `
    }

    return 'dnf install -y libreoffice'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
