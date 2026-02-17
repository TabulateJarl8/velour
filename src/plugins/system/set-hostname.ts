import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'set-hostname' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Set Hostname',
  description: 'Set the system hostname to uniquely identify the machine on the network',
  progressMessage: 'Setting hostname...',
  options: {
    hostname: {
      type: 'text',
      label: 'Enter the new hostname:',
      required: true,
    },
  },
  category: 'System Configuration',

  generate: (config) => {
    return `hostnamectl set-hostname "${config.hostname}"`
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
