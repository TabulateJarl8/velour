import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'set-hostname' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Set Hostname',
  description: 'Set the system hostname to uniquely identify the machine on the network',
  preRunMessage: 'Setting hostname...',
  options: {
    select: {
      type: 'dropdown',
      label: 'dropdown test',
      default: '1',
      options: [
        { label: 'opt1', value: '1' },
        { label: 'op2', value: '2' },
      ],
    },
    hostname: {
      type: 'text',
      label: 'Enter the new hostname:',
      required: true,
      placeholder: 'e.g. fedora-desktop',
      validate: (value: string) => {
        // from: https://man7.org/linux/man-pages/man7/hostname.7.html
        // Valid characters for hostnames are ASCII(7) letters from a to z, the
        // digits from 0 to 9, and the hyphen (-).
        // A hostname may not start with a hyphen.
        if (!/^[a-z0-9.]([a-z0-9-.]*)?$/.test(value))
          return 'Valid characters for hostnames are a-z, 0-9, and the hyphen'

        // The entire hostname, including the dots, can be at most 253
        // characters long.
        if (value.length > 253) return 'Hostname must be at most 253 characters long'

        // Each element of the hostname must be from 1 to 63 characters long.
        // Single trailing dots are ignores
        const parts = value.replace(/\.$/, '').split('.')
        if (parts.length > 1 && parts.some((part) => part.length < 1 || part.length > 63))
          return 'Hostname parts must be between 1-63 characters long'
      },
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
