import { resolveEnabledPlugins, sortPlugins } from './dependencyResolver'
import type { ConcretePluginConfig, ConcretePluginDef } from './types'
import scriptTemplate from './script_template.sh?raw'

/**
 * Function to fix indentation of a plugin's generated bash snippet.
 *
 * @param snippet The bash snippet to fix
 * @returns A properly indented snippet
 */
function formatBash(snippet: string): string {
  // find each leading whitespace before the first non-whitespace character on every line
  const match = snippet.match(/^[ \t]*(?=\S)/gm)
  if (!match) return snippet.trim()

  // find smallest indentation level across every line
  const minIndent = Math.min(...match.map((line) => line.length))

  // remove minIndent amount of whitespace from the beginning of each line
  // TODO: is this the best way to accomplish formatting? it kind of feels hacky
  const regex = new RegExp(`^[ \\t]{${minIndent}}`, 'gm')
  return snippet.replace(regex, '').trim()
}

/**
 * Generates a single bash block from the enabled plugins and their configs.
 *
 * This does not contain the script preamble or footer.
 *
 * @param plugins The full list of plugins
 * @param configs The list of the plugin's configs
 * @param quietMode Whether or not this script should produce output
 * @returns A string containing a bash script for all enabled plugins
 * @see generateFullScript
 */
export function buildPluginScripts(
  plugins: ConcretePluginDef[],
  configs: Record<string, ConcretePluginConfig>,
  quietMode: boolean = false,
): string {
  const activePluginIds = resolveEnabledPlugins(plugins, configs)
  const activePlugins = plugins.filter((p) => activePluginIds.has(p.id))
  const sortedPlugins = sortPlugins(activePlugins)

  const pluginSnippets: string[] = []

  for (const plugin of sortedPlugins) {
    // dependency plugins are not enabled in the UI, so we override it here
    const enabledConfig = configs[plugin.id] || {}
    const config = { ...enabledConfig, enabled: true }
    let snippet = ''

    snippet += `# --- [Plugin] ${plugin.name} ---\n`

    const pluginScript = formatBash(plugin.generate(config))

    // show verbose output in non-quiet mode
    if (!quietMode) {
      snippet += `color_echo "yellow" "${plugin.preRunMessage}"\n`
      snippet += pluginScript.trim()
      if (plugin.postRunMessage) snippet += `\ncolor_echo "green" "${plugin.postRunMessage}"`
    } else {
      // dont show output in quiet mode
      snippet += `{\n${pluginScript}\n}>/dev/null`
    }

    pluginSnippets.push(snippet)
  }

  return pluginSnippets.join('\n\n').trim()
}

/**
 * Generate the full script from the set of enabled plugins and their configs.
 *
 * @param plugins The full list of plugins
 * @param configs The list of the plugin's configs
 * @param quietMode Whether or not this script should produce output
 * @returns The full script as a string
 */
export function generateFullScript(
  plugins: ConcretePluginDef[],
  configs: Record<string, ConcretePluginConfig>,
  quietMode: boolean = false,
): string {
  const pluginsBash = buildPluginScripts(plugins, configs, quietMode)

  const finalScript = scriptTemplate.replace('# {{script_body}}', pluginsBash)
  return finalScript.trim()
}
