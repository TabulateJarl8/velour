import { createPlugin } from '@/core/types'

const plugin = createPlugin({
  id: 'update-firmware',
  name: 'Update Firmware',
  description: 'Check and apply firmware updates to improve hardware compatibility and performance',
  progressMessage: 'Checking for firmware updates...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => {
    return `
      fwupdmgr refresh --force
      fwupdmgr get-updates
      fwupdmgr update -y
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    'update-firmware': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
