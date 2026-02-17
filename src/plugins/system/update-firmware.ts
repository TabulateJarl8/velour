import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'update-firmware' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
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
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
