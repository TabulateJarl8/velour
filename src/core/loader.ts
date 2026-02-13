import { logger } from './logger'
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
  private discoveryProvider: PluginDiscoveryProvider

  /**
   * Creates an instance of PluginLoader with the default vite provider.
   *
   * @class
   */
  constructor()
  /**
   * Creates an instance of PluginLoader with a specified discovery provider.
   *
   * @class
   * @param {PluginDiscoveryProvider} provider
   */
  constructor(discoveryProvider: PluginDiscoveryProvider)

  /**
   * Creates an instance of PluginLoader.
   *
   * @class
   * @param {PluginDiscoveryProvider} provider Optionally provide a specific plugin discovery
   *   provider
   */
  constructor(discoveryProvider?: PluginDiscoveryProvider) {
    if (discoveryProvider) {
      this.discoveryProvider = discoveryProvider
    } else {
      this.discoveryProvider = async () => {
        if (typeof import.meta.glob !== 'function') {
          throw new Error(
            'Default PluginLoader constructor requires Vite, please use a custom provider for node environments',
          )
        }
        return import.meta.glob('../plugins/*.ts') as Record<string, () => Promise<PluginModule>>
      }
    }
  }

  /**
   * Load the plugins from the `src/plugins` folder
   *
   * @async
   * @param {boolean} [quiet=false] Whether or not to print console output. Default is `false`
   * @returns {Promise<Map<string, GenericPlugin>>} A promise to a map of the loaded plugins
   */
  async loadPlugins(quiet: boolean = false): Promise<Map<string, GenericPlugin>> {
    const modules = await this.discoveryProvider()

    // iterate over each module and attempt to load it
    for (const path in modules) {
      const module = (await modules[path]!()) as PluginModule
      const plugin = module.default

      // if current module's exported default is a valid application plugin, add it to the map
      if (this.isValidPlugin(plugin)) {
        this.plugins.set(plugin.id, plugin)

        if (!quiet) logger.info(`[PluginRegistry] Loaded: ${plugin.id}`)
      }
    }

    return this.plugins
  }

  /**
   * Helper function for checking if a given loaded module is a valid application plugin
   *
   * @private
   * @param {unknown} mod The module's exported content to check
   * @returns {mod is GenericPlugin} Whether or not the module is a plugin
   */
  private isValidPlugin(mod: unknown): mod is GenericPlugin {
    return typeof mod === 'object' && mod !== null && 'id' in mod && 'generate' in mod
  }

  /**
   * Get an array of all the loaded plugins
   *
   * @returns {GenericPlugin[]} The array of loaded plugins
   */
  getPlugins(): GenericPlugin[] {
    return Array.from(this.plugins.values())
  }
}

/**
 * Description placeholder
 *
 * @typedef {PluginDiscoveryProvider}
 */
export type PluginDiscoveryProvider = () => Promise<Record<string, () => Promise<PluginModule>>>
