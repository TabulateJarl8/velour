import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'configure-dnf' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Configure DNF',
  description: 'Optimize DNF package manager for faster downloads and efficient updates',
  preRunMessage: 'Configuring DNF Package Manager...',
  options: {
    maxParallelDownloads: {
      type: 'number',
      label: 'Max Parallel Downloads',
      min: 1,
      // https://dnf.readthedocs.io/en/latest/conf_ref.html#integer-label
      max: 20,
      description: 'Set maximum parallel downloads for faster downloads',
      default: 10,
    },
    fastestMirror: {
      type: 'checkbox',
      label: 'Select Fastest Mirror',
      description: 'Selects the fastest download server',
      default: true,
    },
    defaultYes: {
      type: 'checkbox',
      label: 'Default Yes',
      description: 'Defaults prompts to yes, which is how most other package managers behave',
      default: true,
    },
  },
  category: 'System Configuration',

  generate: (config) => {
    let result = `echo "max_parallel_downloads=${config.maxParallelDownloads}" | tee -a /etc/dnf/dnf.conf > /dev/null\n`

    if (config.fastestMirror)
      result += 'echo "fastestmirror=True" | tee -a /etc/dnf/dnf.conf > /dev/null\n'

    if (config.defaultYes)
      result += 'echo "defaultyes=True" | tee -a /etc/dnf/dnf.conf > /dev/null\n'

    return result
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
