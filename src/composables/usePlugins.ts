import { resolveEnabledPlugins } from '@/core/dependencyResolver'
import { PluginLoader } from '@/core/loader'
import { logger } from '@/core/logger'
import { buildPluginScripts, generateFullScript } from '@/core/scriptGenerator'
import {
  Categories,
  CategoryHeadingsData,
  type Category,
  type CategoryHeadings,
  type ConcretePluginConfig,
  type ConcretePluginDef,
} from '@/core/types'
import { computed, onMounted, ref } from 'vue'

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

  const downloadScript = () => {
    // dont download script is there are errors
    if (Object.keys(validationErrors.value).length !== 0) return

    const script = generateFullScript(
      loadedPlugins.value,
      pluginConfigs.value,
      validationErrors.value,
      quietMode.value,
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
          // any is safe here because val is derived from opt
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const validate = opt.validate as (value: any) => true | string | undefined
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

  // config storing in the URL fragment
  const generatePermalink = async (): Promise<string> => {
    if (isLoading.value) return window.location.href

    // get a map of enabled configs
    const activeConfigs: Record<string, ConcretePluginConfig> = {}
    for (const [id, config] of Object.entries(pluginConfigs.value)) {
      if (config.enabled) activeConfigs[id] = config
    }

    const saveState = { configs: activeConfigs, quietMode: quietMode.value }

    // serialize and set URL fragment
    const json = JSON.stringify(saveState)

    // compress
    const stream = new Blob([json]).stream()
    const compressed = stream.pipeThrough(new CompressionStream('deflate-raw'))
    const blob = await new Response(compressed).blob()
    const arrayBuffer = await blob.arrayBuffer()

    // encode
    const byteArray = new Uint8Array(arrayBuffer)
    const base64 = btoa(String.fromCharCode(...byteArray))
    const serialized = encodeURIComponent(base64)

    // set the fragment and return
    const url = new URL(window.location.href)
    url.hash = serialized
    return url.toString()
  }

  // when mounted, load the plugins and init their configs
  onMounted(async () => {
    await loader.loadPlugins()
    loadedPlugins.value = loader.getPlugins()

    const initConfigs: Record<string, ConcretePluginConfig> = {}
    for (const plugin of loadedPlugins.value) {
      initConfigs[plugin.id] = PluginLoader.initializePluginConfig(plugin)
    }

    // try and decode the URL fragment and restore the user's config
    const fragment = window.location.hash.slice(1)
    if (fragment) {
      try {
        const binary = atob(decodeURIComponent(fragment))
        const byteArray = new Uint8Array(binary.length)

        for (let i = 0; i < binary.length; i++) byteArray[i] = binary.charCodeAt(i)

        // decompress and parse
        const stream = new Blob([byteArray]).stream()
        const decompressed = stream.pipeThrough(new DecompressionStream('deflate-raw'))
        const data = JSON.parse(await new Response(decompressed).text())

        // restore quiet mode setting
        if (typeof data.quietMode === 'boolean') quietMode.value = data.quietMode

        // restore plugin configs
        if (data.configs) {
          for (const [id, config] of Object.entries(data.configs)) {
            if (initConfigs[id]) initConfigs[id] = { ...initConfigs[id], ...(config as object) }
          }
        }
      } catch (e) {
        logger.error('Failed to decompress or parse fragment data', e)
      }
    }

    pluginConfigs.value = initConfigs
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
  }
}
