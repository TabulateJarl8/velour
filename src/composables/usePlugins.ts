import { computed, onMounted, ref } from 'vue'

import {
  deserializeConfig,
  extractPayloadFromScript,
  type SaveState,
  serializeConfig,
} from '@/core/configSerde'
import { resolveEnabledPlugins } from '@/core/dependencyResolver'
import { PluginLoader } from '@/core/loader'
import { logger } from '@/core/logger'
import { buildPluginScripts, generateFullScript } from '@/core/scriptGenerator'
import {
  Categories,
  type Category,
  type CategoryHeadings,
  CategoryHeadingsData,
  type ConcretePluginConfig,
  type ConcretePluginDef,
} from '@/core/types'

const SCRIPT_DOWNLOAD_FILENAME = 'velour_fedora_setup.sh'

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

    return buildPluginScripts(
      loadedPlugins.value,
      pluginConfigs.value,
      validationErrors.value,
      quietMode.value,
    )
  })

  const downloadScript = async () => {
    // dont download script is there are errors
    if (Object.keys(validationErrors.value).length !== 0) return

    const payload = await serializeConfig(loadedPlugins.value, pluginConfigs.value, quietMode.value)

    const script = generateFullScript(
      loadedPlugins.value,
      pluginConfigs.value,
      validationErrors.value,
      quietMode.value,
      payload,
    )

    // download script
    const blob = new Blob([script], { type: 'text/x-shellscript' })
    const url = window.URL.createObjectURL(blob)

    const a = window.document.createElement('a')
    a.href = url
    a.style.display = 'none'
    a.download = SCRIPT_DOWNLOAD_FILENAME

    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    window.URL.revokeObjectURL(url)
  }

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

  // check if any options are in an errored state (such as missing a required field)
  const validationErrors = computed<Record<string, string>>(() => {
    if (isLoading.value) return {}

    const errors: Record<string, string> = {}
    const selectedPluginIds = resolveEnabledPlugins(loadedPlugins.value, pluginConfigs.value)
    const selectedPlugins = loadedPlugins.value.filter((p) => selectedPluginIds.has(p.id))

    for (const plugin of selectedPlugins) {
      const config = pluginConfigs.value[plugin.id]
      if (!config) continue

      for (const [key, opt] of Object.entries(plugin.options)) {
        const val = config[key]

        if (opt.validate) {
          // unknown is safe here because val is derived from opt
          const validate = opt.validate as (value: unknown) => true | string | undefined
          const isValid = validate(val)
          if (typeof isValid === 'string') {
            errors[plugin.id] = `Plugin "${plugin.name}": ${isValid}`
            continue
          }
        }

        switch (opt.type) {
          case 'number': {
            if (val === undefined || val === null || String(val).trim() === '') {
              errors[plugin.id] =
                `Plugin "${plugin.name}" has a missing or invalid numeric value for option: ${opt.label}`
              break
            }

            const parsedNum = Number(val)
            if (opt.min !== undefined && parsedNum < opt.min) {
              errors[plugin.id] =
                `Plugin "${plugin.name}" requires a value of at least ${opt.min} for option: ${opt.label}`
              break
            }

            if (opt.max !== undefined && parsedNum > opt.max) {
              errors[plugin.id] =
                `Plugin "${plugin.name}" requires a value of at most ${opt.max} for option: ${opt.label}`
              break
            }

            break
          }
          case 'text': {
            if (val === undefined || val === null || String(val).trim() === '') {
              errors[plugin.id] =
                `Plugin "${plugin.name}" is missing required input for option: ${opt.label}`
              break
            }

            break
          }
          case 'radio':
          case 'dropdown':
          case 'checkbox': {
            break
          }
        }
      }
    }

    return errors
  })

  const _applySaveState = (saveState: SaveState) => {
    const initConfigs: Record<string, ConcretePluginConfig> = {}
    for (const plugin of loadedPlugins.value) {
      initConfigs[plugin.id] = PluginLoader.initializePluginConfig(plugin)
    }

    // restore quiet mode setting
    quietMode.value = typeof saveState.quietMode === 'boolean' ? saveState.quietMode : false

    // restore plugin configs
    if (saveState.configs) {
      for (const [id, config] of Object.entries(saveState.configs)) {
        if (initConfigs[id]) initConfigs[id] = { ...initConfigs[id], ...(config as object) }
      }
    }

    pluginConfigs.value = initConfigs
  }

  // config storing in the URL fragment
  const generatePermalink = async (): Promise<string> => {
    if (isLoading.value) return window.location.href

    const base64 = await serializeConfig(loadedPlugins.value, pluginConfigs.value, quietMode.value)
    const serialized = encodeURIComponent(base64)

    // set the fragment and return
    const url = new URL(window.location.href)
    url.hash = serialized
    return url.toString()
  }

  const importScript = async (file: File) => {
    try {
      const payload = extractPayloadFromScript(await file.text())
      if (!payload) {
        window.alert('No Velour configuration was found in this script')
        return
      }

      const data = await deserializeConfig(payload)
      _applySaveState(data)
    } catch (e) {
      logger.error('Failed to parse uploaded script: ', e)
      window.alert('Invalid or corrupted script configuration')
    }
  }

  // when mounted, load the plugins and init their configs
  onMounted(async () => {
    await loader.loadPlugins()
    loadedPlugins.value = loader.getPlugins()
    let saveState = { configs: {} }

    // try and decode the URL fragment and restore the user's config
    const fragment = window.location.hash.slice(1)
    if (fragment) {
      try {
        saveState = await deserializeConfig(decodeURIComponent(fragment))
      } catch (e) {
        logger.error('Failed to decompress or parse fragment data', e)
      }
    }

    _applySaveState(saveState)
    isLoading.value = false
  })

  return {
    isLoading,
    pluginConfigs,
    quietMode,
    categorizedPlugins,
    generatedScript,
    validationErrors,
    downloadScript,
    generatePermalink,
    importScript,
  }
}
