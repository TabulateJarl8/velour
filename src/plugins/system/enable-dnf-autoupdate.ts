import { createPlugin } from '@/core/types'

const plugin = createPlugin({
  id: 'enable-dnf-autoupdate',
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
    'enable-dnf-autoupdate': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
