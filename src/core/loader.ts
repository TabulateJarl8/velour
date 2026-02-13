import type { GenericPlugin, PluginModule } from './types'

/**
 * Class used to dynamically load plugins from `src/plugins` at compile time
 *
 * @class PluginLoader
 */
export class PluginLoader {
  /**
   * A map of the loaded plugins
   *
   * @private
   * @type {Map<string, GenericPlugin>}
   */
  private plugins: Map<string, GenericPlugin> = new Map<string, GenericPlugin>()

  /**
   * Load the plugins from the `src/plugins` folder
   *
   * @async
   * @returns {Promise<Map<string, GenericPlugin>>} a promise to a map of the loaded plugins
   */
  async loadPlugins(): Promise<Map<string, GenericPlugin>> {
    const modules = import.meta.glob('../plugins/*.ts')

    // iterate over each module and attempt to load it
    for (const path in modules) {
      const module = (await modules[path]!()) as PluginModule
      const plugin = module.default

      // if current module's exported default is a valid application plugin, add it to the map
      if (this.isValidPlugin(plugin)) {
        this.plugins.set(plugin.id, plugin)
        console.log(`[PluginRegistry] Loaded: ${plugin.id}`)
      }
    }

    return this.plugins
  }

  /**
   * Helper function for checking if a given loaded module is a valid application plugin
   *
   * @private
   * @param {unknown} mod the module's exported content to check
   * @returns {mod is GenericPlugin} whether or not the module is a plugin
   */
  private isValidPlugin(mod: unknown): mod is GenericPlugin {
    return typeof mod === 'object' && mod !== null && 'id' in mod && 'generate' in mod
  }

  /**
   * Get an array of all the loaded plugins
   *
   * @returns {GenericPlugin[]} the array of loaded plugins
   */
  getPlugins(): GenericPlugin[] {
    return Array.from(this.plugins.values())
  }
}
