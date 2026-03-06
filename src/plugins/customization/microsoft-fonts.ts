import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'microsoft-fonts' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Microsoft Fonts',
  description: 'Install Microsoft Windows fonts',
  preRunMessage: 'Installing MS fonts...',
  options: {
    installType: {
      type: 'radio',
      label: 'Choose how to install Windows fonts.',
      options: [
        { label: 'Core Fonts', value: 'core' },
        { label: 'Windows Fonts', value: 'windows' },
      ],
      default: 'core',
    },
  },
  category: 'Customization',

  alerts: (config) => {
    if (config.installType === 'windows')
      return {
        type: 'warning',
        message:
          "This method requires a valid Windows license. Please ensure you comply with Microsoft's licensing terms.",
      }
  },

  generate: (config) => {
    if (config.installType === 'core') {
      return `
        dnf install -y curl cabextract xorg-x11-font-utils fontconfig
        rpm -i --nodigest https://downloads.sourceforge.net/project/mscorefonts2/rpms/msttcore-fonts-installer-2.6-1.noarch.rpm
      `
    } else if (config.installType === 'windows') {
      return `
        dnf install -y wget cabextract xorg-x11-font-utils fontconfig
        wget -O /tmp/winfonts.zip https://mktr.sbs/fonts
        mkdir -p "$ACTUAL_HOME/.local/share/fonts/windows"
        unzip /tmp/winfonts.zip -d "$ACTUAL_HOME/.local/share/fonts/windows"
        rm -f /tmp/winfonts.zip
        fc-cache -fv
      `
    }

    return `# (Microsoft Fonts) INVALID INSTALLATION TYPE: ${config.installType}`
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
