import { type ConcretePluginConfig, type ConcretePluginDef, SUB_OPTION_DEFAULTS } from './types'

export interface SaveState {
  configs: Record<string, ConcretePluginConfig>
  quietMode?: boolean
}

const minifyConfig = (
  plugins: ConcretePluginDef[],
  configs: Record<string, ConcretePluginConfig>,
  quietMode: boolean,
): SaveState => {
  // get a map of enabled configs
  const activeConfigs: Record<string, ConcretePluginConfig> = {}
  for (const [id, config] of Object.entries(configs)) {
    if (!config.enabled) continue

    const plugin = plugins.find((p) => p.id === id)
    if (!plugin) continue

    const minimalConfig: ConcretePluginConfig = {
      enabled: true,
    }

    // check each option
    for (const [key, schema] of Object.entries(plugin.options)) {
      const defaultValue =
        schema.default !== undefined ? schema.default : SUB_OPTION_DEFAULTS[schema.type]

      // only add to config if the option has been changed from the default
      if (config[key as keyof typeof config] !== defaultValue) {
        minimalConfig[key] = config[key as keyof typeof config]
      }
    }

    activeConfigs[id] = minimalConfig
  }

  const saveState: SaveState = { configs: activeConfigs }
  if (quietMode) saveState.quietMode = true

  return saveState
}

export const serializeConfig = async (
  plugins: ConcretePluginDef[],
  configs: Record<string, ConcretePluginConfig>,
  quietMode: boolean,
): Promise<string> => {
  const saveState = minifyConfig(plugins, configs, quietMode)

  // serialize and set URL fragment
  const json = JSON.stringify(saveState)

  // compress
  const stream = new Blob([json]).stream()
  const compressed = stream.pipeThrough(new CompressionStream('deflate-raw'))
  const blob = await new Response(compressed).blob()
  const arrayBuffer = await blob.arrayBuffer()

  // encode
  const byteArray = new Uint8Array(arrayBuffer)
  return btoa(String.fromCharCode(...byteArray))
}

export const deserializeConfig = async (base64: string): Promise<SaveState> => {
  const binary = atob(base64)
  const byteArray = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) byteArray[i] = binary.charCodeAt(i)

  // decompress and parse
  const stream = new Blob([byteArray]).stream()
  const decompressed = stream.pipeThrough(new DecompressionStream('deflate-raw'))
  return JSON.parse(await new Response(decompressed).text())
}

export const extractPayloadFromScript = (script: string): string | null => {
  const lines = script.trim().split('\n')
  const match = lines[lines.length - 1].match(/^# VELOUR_CONFIG_STATE=(.*)/v)
  return match && match[1] ? match[1] : null
}
