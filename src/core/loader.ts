import { logger } from './logger'
import type { ConcretePluginDef, PluginModule } from './types'

/** Class used to dynamically load plugins from `src/plugins` at compile time */
export class PluginLoader {
  /** A map of the loaded plugins */
  private plugins: Map<string, ConcretePluginDef> = new Map<string, ConcretePluginDef>()

  /**
   * A plugin discovery provider. Used for switching between vite loading and node loading of
   * plugins. Defaults to vite loading
   */
  private discoveryProvider: PluginDiscoveryProvider

  /**
   * Creates an instance of PluginLoader.
   *
   * @param discoveryProvider Optionally provide a specific plugin discovery provider
   */
  constructor(discoveryProvider?: PluginDiscoveryProvider) {
    if (discoveryProvider) {
      this.discoveryProvider = discoveryProvider
    } else {
      this.discoveryProvider = async () => {
        return import.meta.glob('../plugins/*.ts') as Record<string, () => Promise<PluginModule>>
      }
    }
  }

  /**
   * Load the plugins from the `src/plugins` folder
   *
   * @async
   * @param [quiet] Whether or not to print console output. Default is `false`
   * @returns A promise to a map of the loaded plugins
   */
  async loadPlugins(quiet: boolean = false): Promise<Map<string, ConcretePluginDef>> {
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
   * @param mod The module's exported content to check
   * @returns Whether or not the module is a plugin
   */
  private isValidPlugin(mod: unknown): mod is ConcretePluginDef {
    return typeof mod === 'object' && mod !== null && 'id' in mod && 'generate' in mod
  }

  /**
   * Get an array of all the loaded plugins
   *
   * @returns The array of loaded plugins
   */
  getPlugins(): ConcretePluginDef[] {
    return Array.from(this.plugins.values())
  }
}

/** The type of the plugin discovery provider function */
export type PluginDiscoveryProvider = () => Promise<Record<string, () => Promise<PluginModule>>>
