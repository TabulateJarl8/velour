import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'enable-rpmfusion' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'RPM Fusion Repositories',
  description: 'Enable RPM Fusion repositories to access additional software packages and codecs',
  preRunMessage: 'Enabling RPM Fusion Repositories...',
  options: {},
  category: 'System Configuration',

  generate: (_config) => {
    return `
      dnf install -y "https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm"
      dnf install -y "https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm"
      dnf update @core -y
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
