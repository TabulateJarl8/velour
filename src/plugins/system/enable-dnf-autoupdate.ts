import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'enable-dnf-autoupdate' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Enable DNF Autoupdate',
  description: 'Enable and configure automatic system updates to enhance security and stability',
  progressMessage: 'Enabling DNF autoupdate...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => {
    return `
      dnf install dnf-automatic -y
      sed -i 's/apply_updates = no/apply_updates = yes/' /etc/dnf/automatic.conf
      systemctl enable --now dnf-automatic.timer
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
