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

// // the typescript type engine will bend to my will and become rust whether it wants to or not

type SubOptionsConfig<T extends Record<string, SubOptionSchema>> = {
  [K in keyof T]?: SubOptionTypeMap[T[K]['type']]
}

export type PluginConfig<T extends Record<string, SubOptionSchema>> = {
  enabled: boolean
} & SubOptionsConfig<T>

export interface PluginDef<T extends Record<string, SubOptionSchema>> {
  id: string
  name: string
  options: T

  generate: (config: PluginConfig<T>) => string
}

/**
 * Generic plugin definition
 *
 * This is to be used when you don't need to know the concrete type of the generic (for example, in plugin loading)
 *
 * @export
 */
export type GenericPlugin = PluginDef<Record<string, SubOptionSchema>>

/**
 * Interface describing a loaded module that may be a Velour plugin
 *
 * @export
 * @interface PluginModule
 */
export interface PluginModule {
  default?: GenericPlugin
}

export type RegisterPlugin<T> = T extends PluginDef<infer S> ? PluginConfig<S> : never

/**
 * Constructor function to appease the TypeScript compiler
 *
 * @export
 * @template {Record<string, SubOptionSchema>} T the plugin suboption's with their config schema
 * @param {PluginDef<T>} plugin the plugin definition
 * @returns {PluginDef<T>} the same plugin defintion
 */
export function createPlugin<T extends Record<string, SubOptionSchema>>(
  plugin: PluginDef<T>,
): PluginDef<T> {
  return plugin
}
