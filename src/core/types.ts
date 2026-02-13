/**
 * Mapping between the plugin option types and the real type of their value.
 *
 * @interface SubOptionTypeMap
 */
interface SubOptionTypeMap {
  /**
   * Checkboxes have two states - true (checked) and false (unchecked)
   *
   * @type {boolean}
   */
  checkbox: boolean
  /**
   * Number inputs have a type of number
   *
   * @type {number}
   */
  number: number
  /**
   * Textbox inputs have a type of string
   *
   * @type {string}
   */
  text: string
}

/** Aggregate type representing types that suboptions can be (checkbox, number, etc) */
type SubOptionType = keyof SubOptionTypeMap

/**
 * Base fields that every option should have
 *
 * @template {SubOptionType} K The possible types a suboption can be (checkbox, number, etc)
 */
type BaseSubOption<K extends SubOptionType> = {
  type: K
  label: string
  description: string
}

/**
 * Checkbox suboption schema definition
 *
 * @extends {BaseSubOption<'checkbox'>} Extends the base option fields with a type of checkbox
 * @interface CheckboxSubOption
 */
interface CheckboxSubOption extends BaseSubOption<'checkbox'> {
  /**
   * Optional default value - checked (true) or unchecked (false)
   *
   * @type {boolean | null}
   */
  default?: boolean
}

/**
 * Number suboption schema definition
 *
 * @extends {BaseSubOption<'number'>} Extends the base option fields with a type of number
 * @interface NumberSubOption
 */
interface NumberSubOption extends BaseSubOption<'number'> {
  /**
   * Optional minimum value
   *
   * @type {number | null}
   */
  min?: number
  /**
   * Optional maximum value
   *
   * @type {number | null}
   */
  max?: number
  /**
   * Optional default value
   *
   * @type {number | null}
   */
  default?: number
}

/**
 * Text input suboption schema definition
 *
 * @extends {BaseSubOption<'text'>} Extends the base option fields with a type of text
 * @interface TextSubOption
 */
interface TextSubOption extends BaseSubOption<'text'> {
  /**
   * Optional field placeholder
   *
   * @type {string | null}
   */
  placeholder?: string
  /**
   * Optional default value
   *
   * @type {string | null}
   */
  default?: string
}

/**
 * Aggregate type for a generic "suboption" of some type
 */
export type SubOptionSchema = CheckboxSubOption | NumberSubOption | TextSubOption

// the typescript type engine will bend to my will and become rust whether it wants to or not

/**
 * Type inference helper that maps each option's type to its corresponding TS type
 *
 * @template {Record<string, SubOptionSchema>} T A map of named options with values that are of the
 *   suboption schema
 */
type SubOptionsConfig<T extends Record<string, SubOptionSchema>> = {
  [K in keyof T]?: SubOptionTypeMap[T[K]['type']]
}

/**
 * Represents a plugin that can be enabled/disabled by the app via checkbox. Contains any suboptions
 * that are specified.
 *
 * @template {Record<string, SubOptionSchema>} T The map of suboptions for the particular plugin
 *   config
 */
export type PluginConfig<T extends Record<string, SubOptionSchema>> = {
  enabled: boolean
} & SubOptionsConfig<T>

/**
 * A full plugin definition interface
 *
 * @template {Record<string, SubOptionSchema>} T Map of suboptions, if any
 * @interface PluginDef
 */
export interface PluginDef<T extends Record<string, SubOptionSchema>> {
  /**
   * The unique id of the plugin
   *
   * @type {string}
   */
  id: string
  /**
   * The plugin's human-readable name
   *
   * @type {string}
   */
  name: string
  /**
   * The plugin's description/help
   *
   * @type {string}
   */
  description: string
  /**
   * Map of any suboptions
   *
   * @type {T}
   */
  options: T

  /**
   * Provides a state of the filled-out config used to generate line(s) of a script
   *
   * @type {(config: PluginConfig<T>) => string}
   * @returns {string} One or more lines of a bash script based on what the user selected in the plugin's
   *   config
   */
  generate: (config: PluginConfig<T>) => string
}

/**
 * Generic plugin definition
 *
 * This is to be used when you don't need to know the concrete type of the generic (for example, in
 * plugin loading)
 */
export type GenericPlugin = PluginDef<Record<string, SubOptionSchema>>

/**
 * Interface describing a loaded module that may be a Velour plugin
 *
 * @interface PluginModule
 */
export interface PluginModule {
  /**
   * A module's content from `export default ...`, if any
   *
   * @type {GenericPlugin | null}
   */
  default?: GenericPlugin
}

/**
 * Utility type used in registering a plugin to make it a bit neater.
 *
 * It uses type inference to look at `PluginDef`, identify its specific options schema, and return
 * the appropriate `PluginConfig`
 *
 * @template T a type that should extend `PluginDef`
 * @returns {PluginConfig<S> | never} The configuration type for the plugin, or never if invalid
 */
export type RegisterPlugin<T> = T extends PluginDef<infer S> ? PluginConfig<S> : never

/**
 * Constructor function to appease the TypeScript compiler
 *
 * @template {Record<string, SubOptionSchema>} T The plugin's map of suboptions, if any
 * @param {PluginDef<T>} plugin The plugin definition
 * @returns {PluginDef<T>} The same plugin definition
 */
export function createPlugin<T extends Record<string, SubOptionSchema>>(
  plugin: PluginDef<T>,
): PluginDef<T> {
  return plugin
}
