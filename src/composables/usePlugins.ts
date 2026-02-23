import { PluginLoader } from '@/core/loader'
import { buildPluginScripts } from '@/core/scriptGenerator'
import {
  Categories,
  CategoryHeadingsData,
  type Category,
  type CategoryHeadings,
  type ConcretePluginConfig,
  type ConcretePluginDef,
} from '@/core/types'
import { computed, onMounted, ref } from 'vue'

export interface PluginGroup {
  heading: CategoryHeadings[keyof CategoryHeadings] | null
  plugins: ConcretePluginDef[]
}

export interface CategoryGroup {
  name: Category
  pluginGroups: PluginGroup[]
}

/**
 * State manager composable for everything related to plugins
 *
 * @returns The full state of anything plugin-related
 */
export function usePlugins() {
  const loader = new PluginLoader()
  const loadedPlugins = ref<ConcretePluginDef[]>([])
  const isLoading = ref(true)
  const pluginConfigs = ref<Record<string, ConcretePluginConfig>>({})
  const quietMode = ref(false)

  // computed bash script from the plugin configs
  const generatedScript = computed(() => {
    if (isLoading.value) {
      return '# Loading plugins...'
    }
    return buildPluginScripts(loadedPlugins.value, pluginConfigs.value, quietMode.value)
  })

  // plugins in their categories
  const categorizedPlugins = computed<CategoryGroup[]>(() => {
    // map each category to a list of associated plugins/headings
    return Object.values(Categories).map((category) => {
      const hasHeadings = category in CategoryHeadingsData
      const pluginGroups = []

      if (hasHeadings) {
        // if current category has headings, iterate over each one and add list of
        // plugins under that heading
        for (const heading of CategoryHeadingsData[category as keyof typeof CategoryHeadingsData]) {
          const plugins = loadedPlugins.value.filter(
            (p) => p.category === category && p.heading === heading,
          )
          if (plugins.length > 0) pluginGroups.push({ heading, plugins })
        }
      } else {
        // no headings; add all plugins from the category
        const plugins = loadedPlugins.value.filter((p) => p.category === category)
        if (plugins.length > 0) pluginGroups.push({ heading: null, plugins })
      }

      return {
        name: category,
        pluginGroups,
      }
    })
  })

  // when mounted, load the plugins and init their configs
  onMounted(async () => {
    await loader.loadPlugins()
    loadedPlugins.value = loader.getPlugins()

    const initConfigs: Record<string, ConcretePluginConfig> = {}
    for (const plugin of loadedPlugins.value) {
      initConfigs[plugin.id] = PluginLoader.initializePluginConfig(plugin)
    }

    pluginConfigs.value = initConfigs
    isLoading.value = false
  })

  return { isLoading, pluginConfigs, quietMode, categorizedPlugins, generatedScript }
}
