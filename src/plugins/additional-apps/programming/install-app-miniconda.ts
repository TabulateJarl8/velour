import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'install-app-miniconda' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Miniconda',
  description: 'Install Miniconda Python distribution',
  progressMessage: 'Installing Miniconda...',
  options: {},
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (_config) => {
    return `
sudo -u "$ACTUAL_USER" bash << EOF
  mkdir -p "$ACTUAL_HOME/.miniconda3"
  wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O "$ACTUAL_HOME/.miniconda3/miniconda.sh"
  bash "$ACTUAL_HOME/.miniconda3/miniconda.sh" -b -u -p "$ACTUAL_HOME/.miniconda3"
  rm -f "$ACTUAL_HOME/.miniconda3/miniconda.sh"
  $ACTUAL_HOME/.miniconda3/bin/conda init bash
  $ACTUAL_HOME/.miniconda3/bin/conda init zsh
EOF
    `
  },
})

export default plugin

declare module '@/core/registry' {
  interface PluginRegistry {
    [PLUGIN_ID]: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
