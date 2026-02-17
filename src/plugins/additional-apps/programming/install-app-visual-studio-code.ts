import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-visual-studio-code' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Visual Studio Code',
  description: 'A powerful source code editor',
  progressMessage: 'Installing Visual Studio Code...',
  options: {},
  dependencies: [],
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return `
      rpm --import https://packages.microsoft.com/keys/microsoft.asc
      echo -e "[code]\nname=Visual Studio Code\nbaseurl=https://packages.microsoft.com/yumrepos/vscode\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" | sudo tee /etc/yum.repos.d/vscode.repo > /dev/null
      dnf install -y code
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
