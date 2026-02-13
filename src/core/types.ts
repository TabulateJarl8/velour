interface SubOptionTypeMap {
  checkbox: boolean
  number: number
  text: string
}

type SubOptionType = keyof SubOptionTypeMap

type BaseSubOption<K extends SubOptionType> = {
  type: K
  label: string
  description: string
}

interface CheckboxSubOption extends BaseSubOption<'checkbox'> {
  default?: boolean
}

interface NumberSubOption extends BaseSubOption<'number'> {
  min?: number
  max?: number
  default?: number
}

interface TextSubOption extends BaseSubOption<'text'> {
  placeholder?: string
  default?: string
}

export type SubOptionSchema = CheckboxSubOption | NumberSubOption | TextSubOption

export interface FeatureSchema {
  label: string
  description: string
  subOptions?: Record<string, SubOptionSchema>
}

// the typescript type engine will bend to my will and become rust whether it wants to or not

type InferSubValue<T extends SubOptionSchema> = SubOptionTypeMap[T['type']]

type InferSubOptions<T extends Record<string, SubOptionSchema>> = {
  [K in keyof T]: InferSubValue<T[K]>
}

type InferFeatureConfig<T extends FeatureSchema> =
  T['subOptions'] extends Record<string, SubOptionSchema>
    ? { enabled: boolean } & InferSubOptions<T['subOptions']>
    : { enabled: boolean }

export type InferPluginConfig<T extends Record<string, FeatureSchema>> = {
  [K in keyof T]: InferFeatureConfig<T[K]>
}

export interface PluginDef<T extends Record<string, FeatureSchema>> {
  id: string
  name: string
  options: T

  generate: (config: InferPluginConfig<T>) => string
}

/**
 * Generic plugin definition
 *
 * This is to be used when you don't need to know the concrete type of the generic (for example, in plugin loading)
 *
 * @export
 */
export type GenericPlugin = PluginDef<Record<string, FeatureSchema>>

/**
 * Interface describing a loaded module that may be a Velour plugin
 *
 * @export
 * @interface PluginModule
 */
export interface PluginModule {
  default?: GenericPlugin
}

/**
 * Constructor function to appease the TypeScript compiler
 *
 * @export
 * @template {Record<string, FeatureSchema>} T the plugin config schema
 * @param {PluginDef<T>} plugin the plugin definition
 * @returns {PluginDef<T>} the same plugin defintion
 */
export function createPlugin<T extends Record<string, FeatureSchema>>(
  plugin: PluginDef<T>,
): PluginDef<T> {
  return plugin
}
