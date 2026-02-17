import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-docker' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Docker',
  description: 'A platform for building, shipping, and running applications in containers',
  progressMessage: 'Installing Docker...',
  options: {},
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  dependencies: ['install-dnf-plugins-core'],
  generate: (_config) => {
    return `
      dnf remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-selinux docker-engine-selinux docker-engine --noautoremove
      dnf -y install dnf-plugins-core
      if command -v dnf4 &>/dev/null; then
        dnf4 config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
      else
        dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
      fi
      dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
      systemctl enable --now docker
      systemctl enable --now containerd
      groupadd docker
      usermod -aG docker $ACTUAL_USER
      rm -rf $ACTUAL_HOME/.docker
      echo "Docker installed successfully. Please log out and back in for the group changes to take effect."
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
