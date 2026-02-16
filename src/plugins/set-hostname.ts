import { createPlugin } from '../core/types'

const plugin = createPlugin({
  id: 'set-hostname',
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

declare module '../core/registry' {
  interface PluginRegistry {
    'set-hostname': import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
