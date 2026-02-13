import type { GenericPlugin, PluginModule } from './types'

export class PluginLoader {
  private plugins = new Map<string, GenericPlugin>()

  async loadPlugins() {
    const modules = import.meta.glob('../plugins/*.ts')

    for (const path in modules) {
      const module = (await modules[path]!()) as PluginModule
      const plugin = module.default

      if (this.isValidPlugin(plugin)) {
        this.plugins.set(plugin.id, plugin)
        console.log(`[PluginRegistry] Loaded: ${plugin.id}`)
      }
    }

    return this.plugins
  }

  private isValidPlugin(mod: unknown): mod is GenericPlugin {
    return typeof mod === 'object' && mod !== null && 'id' in mod && 'generate' in mod
  }

  getPlugins() {
    return Array.from(this.plugins.values())
  }
}
