import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-vscodium' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'VSCodium',
  description: 'A free and open-source distribution of VSCode',
  progressMessage: 'Installing VSCodium...',
  options: {},
  dependencies: [],
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return `
      rpmkeys --import https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/-/raw/master/pub.gpg
      printf "[gitlab.com_paulcarroty_vscodium_repo]\nname=download.vscodium.com\nbaseurl=https://download.vscodium.com/rpms/\nenabled=1\ngpgcheck=1\nrepo_gpgcheck=1\ngpgkey=https://gitlab.com/paulcarroty/vscodium-deb-rpm-repo/-/raw/master/pub.gpg\nmetadata_expire=1h" | sudo tee -a /etc/yum.repos.d/vscodium.repo
      dnf install -y codium
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
