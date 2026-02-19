import { resolveEnabledPlugins, sortPlugins } from './dependencyResolver'
import type { ConcretePluginConfig, ConcretePluginDef } from './types'

/**
 * Trim the start and end whitespace of each line in a text.
 *
 * @param text The text to trim
 * @returns The trimmed text
 */
function trimEachLine(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
}

/**
 * Generate the full script from the set of enabled plugins and their configs.
 *
 * @param plugins The full list of plugins
 * @param configs The list of the plugin's configs
 * @param quietMode Whether or not this script should produce output
 * @returns The full script as a string
 */
export function generateScript(
  plugins: ConcretePluginDef[],
  configs: Record<string, ConcretePluginConfig>,
  quietMode: boolean = false,
): string {
  const activePluginIds = resolveEnabledPlugins(plugins, configs)
  const activePlugins = plugins.filter((p) => activePluginIds.has(p.id))
  const sortedPlugins = sortPlugins(activePlugins)

  let script = '#!/usr/bin/env bash\n\nset -e\n'

  for (const plugin of sortedPlugins) {
    // dependency plugins are not enabled in the UI, so we override it here
    const enabledConfig = configs[plugin.id]
    const config = { ...enabledConfig, enabled: true }

    script += `# --- [Plugin] ${plugin.name} ---\n`

    const pluginScript = plugin.generate(config)

    if (!quietMode) {
      script += `
        color_echo "yellow" "${plugin.preRunMessage}"
        ${pluginScript}
      `

      if (plugin.postRunMessage) script += `color_echo "green" "${plugin.postRunMessage}"\n`
    } else {
      script += `{\n${pluginScript}\n}>/dev/null\n`
    }
  }

  return trimEachLine(script)
}
