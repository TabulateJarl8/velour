import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-vivaldi' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Vivaldi',
  description:
    'Feature-rich, customizable web browser with built-in productivity tools and privacy features',
  preRunMessage: 'Installing Vivaldi...',
  options: {
    source: {
      type: 'radio',
      default: 'dnf',
      label: 'Choose Vivaldi installation type:',
      options: [
        { label: 'DNF', value: 'dnf' },
        { label: 'Flatpak', value: 'flatpak' },
      ],
    },
  },
  category: 'Additional Applications',
  heading: 'Internet & Communication',
  generate: (config) => {
    if (config.source === 'dnf') {
      return `
      wget "https://downloads.vivaldi.com/stable/vivaldi-stable-7.8.3925.66-1.x86_64.rpm"
      dnf install --nogpgcheck -y ./vivaldi*.rpm
      rm -f vivaldi*.rpm
    `
    } else {
      return 'flatpak install -y flathub com.vivaldi.Vivaldi'
    }
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
