import { logger } from './logger'
import type { ConcretePluginConfig, ConcretePluginDef } from './types'

/**
 * Resolve dependencies of the enabled plugins
 *
 * @param plugins The list of plugins
 * @param configs The list of plugin configs
 * @returns A set containing the ID of each enabled plugin and it's dependencies
 */
export function resolveEnabledPlugins(
  plugins: ConcretePluginDef[],
  configs: Record<string, ConcretePluginConfig>,
): Set<string> {
  const pluginMap = new Map(plugins.map((p) => [p.id, p]))
  const activePlugins = new Set<string>()
  const queue: string[] = []

  for (const plugin of plugins) {
    if (configs[plugin.id]?.enabled) {
      activePlugins.add(plugin.id)
      queue.push(plugin.id)
    }
  }

  // do a breadth first search to find dependencies
  while (queue.length > 0) {
    const pluginId = queue.shift()!
    const plugin = pluginMap.get(pluginId)

    if (plugin?.dependencies) {
      for (const dep of plugin.dependencies) {
        if (!activePlugins.has(dep)) {
          activePlugins.add(dep)
          queue.push(dep)
        }
      }
    }
  }

  return activePlugins
}

/**
 * Sort plugins in a way that the generated script can be run top-down without dependency issues
 *
 * @param plugins The list of plugins to sort
 * @returns A sorted list of plugins
 */
export function sortPlugins(plugins: ConcretePluginDef[]): ConcretePluginDef[] {
  const sorted: ConcretePluginDef[] = []
  const visited = new Set<string>()
  const pluginMap = new Map(plugins.map((p) => [p.id, p]))

  const visitFn = (plugin: ConcretePluginDef, path: string[]) => {
    if (visited.has(plugin.id)) return

    // detect dependency cycles
    if (path.includes(plugin.id)) {
      const cycleStart = path.indexOf(plugin.id)
      const cycle = path.slice(cycleStart)

      const error = [...cycle, plugin.id].join(' -> ')
      logger.warning(`Circular dependency detected: ${error}`)
      return
    }

    // append this plugin onto the current path
    const newPath = [...path, plugin.id]
    if (plugin.dependencies) {
      // visit each dependency
      for (const dep of plugin.dependencies) {
        const depPlugin = pluginMap.get(dep)
        if (depPlugin) visitFn(depPlugin, newPath)
      }
    }

    // add this plugin to the visited list and put it in the sorted array
    visited.add(plugin.id)
    sorted.push(plugin)
  }

  plugins.forEach((p) => visitFn(p, []))

  return sorted
}
