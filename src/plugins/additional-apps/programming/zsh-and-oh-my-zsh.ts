import { createPlugin } from '@/core/types'

const PLUGIN_ID = 'zsh-and-oh-my-zsh' as const

const plugin = createPlugin({
  id: PLUGIN_ID,
  name: 'Zsh and Oh My Zsh',
  description: 'Install Zsh shell and Oh My Zsh framework',
  progressMessage: 'Installing Zsh and Oh My Zsh...',
  options: {
    zshAutosuggestions: {
      type: 'checkbox',
      label: 'Zsh Autosuggestions',
      description: 'Suggests commands as you type based on history',
      default: true,
    },
    zshSyntaxHighlighting: {
      type: 'checkbox',
      label: 'Syntax Highlighting',
      description: 'Highlights commands in green (valid) or red (invalid) as you type',
      default: true,
    },
    zshHistorySubstringSearch: {
      type: 'checkbox',
      label: 'History Substring Search',
      description: 'Type part of a command and press Up/Down to find it',
      default: true,
    },
    zshAutocomplete: {
      type: 'checkbox',
      label: 'Zsh Autocomplete',
      description: 'Real-time dropdown menu for tab completion',
      default: true,
    },
    zshZ: {
      type: 'checkbox',
      label: 'Z (Jump)',
      description: 'Jump to frequently used directories using regex (e.g., "z down")',
      default: true,
    },
  },
  category: 'Additional Applications',
  heading: 'Programming and DevOps',
  generate: (config) => {
    const plugins = ['dnf', 'aliases', 'genpass', 'git']
    const repos: Partial<Record<keyof typeof config, { name: string; url: string }>> = {
      zshAutosuggestions: {
        name: 'zsh-autosuggestions',
        url: 'https://github.com/zsh-users/zsh-autosuggestions',
      },
      zshAutocomplete: {
        name: 'zsh-autocomplete',
        url: 'https://github.com/marlonrichert/zsh-autocomplete.git',
      },
      zshHistorySubstringSearch: {
        name: 'zsh-history-substring-search',
        url: 'https://github.com/zsh-users/zsh-history-substring-search',
      },
      zshSyntaxHighlighting: {
        name: 'zsh-syntax-highlighting',
        url: 'https://github.com/zsh-users/zsh-syntax-highlighting.git',
      },
    }

    // build the bash array of repos to clone
    let repoArray = ''
    const keys = Object.keys(config) as Array<keyof typeof config>
    keys.forEach((key) => {
      if (config[key]) {
        const repo = repos[key]
        if (repo) {
          plugins.push(repo.name)
          // ["name"]="url"
          repoArray += `        ["${repo.name}"]="${repo.url}" `
        }
      }
    })

    if (config.zshZ) {
      plugins.push('z')
    }

    if (plugins.includes('zsh-syntax-highlighting')) {
      plugins.push(plugins.splice(plugins.indexOf('zsh-syntax-highlighting'), 1)[0]!)
    }
    const pluginsString = plugins.join(' ')

    // TODO: test all of this
    return `
      dnf install -y zsh git
      chsh -s $(which zsh) $ACTUAL_USER

      sudo -u $ACTUAL_USER bash << EOF
        HOME_DIR="$ACTUAL_HOME"
        ZSH_CUSTOM="$HOME_DIR/.oh-my-zsh/custom"
        RUNZSH=no sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

        declare -A plugins
        plugins=(${repoArray})

        for plugin in "\${!plugins[@]}"; do
          if [ ! -d "$ZSH_CUSTOM/plugins/$plugin" ]; then
            echo "Installing $plugin..."
            git clone --depth 1 "\${plugins[$plugin]}" "$ZSH_CUSTOM/plugins/$plugin"
          fi
        done

        sed -i 's/^plugins=(.*)/plugins=(${pluginsString})/' "$HOME_DIR/.zshrc"
        sed -i 's/^ZSH_THEME=".*"/ZSH_THEME="jonathan"/' "$HOME_DIR/.zshrc"
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
