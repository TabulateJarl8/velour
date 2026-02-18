import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-android-studio' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Android Studio',
  description: 'The official Integrated Development Environment (IDE) for Android app development',
  preRunMessage: 'Installing Android Studio...',
  options: {},
  dependencies: ['remove-fedora-flatpak-repos'],
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return 'flatpak install -y flathub com.google.AndroidStudio'
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
