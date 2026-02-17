import type { Category, CategoryHeadings } from './categories'
import type { PluginRegistry } from '../registry'
import type { SubOptionSchema, SubOptionTypeMap } from './options'

// the typescript type engine will bend to my will and become rust whether it wants to or not

/**
 * Type inference helper that maps each option's type to its corresponding TS type
 *
 * @template {Record<string, SubOptionSchema>} T A map of named options with values that are of the
 *   suboption schema
 */
type SubOptionsConfig<T extends Record<string, SubOptionSchema>> = {
  [K in keyof T]: SubOptionTypeMap[T[K]['type']]
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
 * Base properties of a full plugin definition interface
 *
 * @template {Record<string, SubOptionSchema>} T Map of suboptions, if any
 */
interface BasePluginDef<T extends Record<string, SubOptionSchema>> {
  /** The unique id of the plugin */
  id: string
  /** The plugin's human-readable name */
  name: string
  /** The plugin's description/help */
  description: string
  /** Progress message to display right before the plugin is run */
  progressMessage: string
  /** Map of any suboptions */
  options: T
  /** Optional list of plugin ids this plugin requires */
  dependencies?: (keyof PluginRegistry)[]

  /**
   * Provides a state of the filled-out config used to generate line(s) of a script
   *
   * @returns {string} One or more lines of a bash script based on what the user selected in the
   *   plugin's config
   */
  generate: (config: PluginConfig<T>) => string
}

/**
 * Represents a full plugin definition
 *
 * @template {Record<string, SubOptionSchema>} T Map of suboptions, if any
 */
export type PluginDef<T extends Record<string, SubOptionSchema>> =
  // iterate over keys of CategoryHeadings and make variants for each heading
  | {
      [K in keyof CategoryHeadings]: BasePluginDef<T> & {
        /** The collapsible category that this plugin belongs to */
        category: K
        /** The heading within the category to place this plugin under */
        heading: CategoryHeadings[K]
      }
    }[keyof CategoryHeadings]
  // Categories without headings
  | (BasePluginDef<T> & {
      /** The collapsible category that this plugin belongs to */
      category: Exclude<Category, keyof CategoryHeadings>
      /** Categories that don't support headings should never have one */
      heading?: never
    })

/** Concrete plugin definition type with the generic filled in */
export type ConcretePluginDef = PluginDef<Record<string, SubOptionSchema>>

/** Concrete plugin config type with the generic filled in */
export type ConcretePluginConfig = PluginConfig<Record<string, SubOptionSchema>>

/** Interface describing a loaded module that may be a Velour plugin */
export interface PluginModule {
  /** A module's content from `export default ...`, if any */
  default?: ConcretePluginDef
}

/**
 * Utility type used in registering a plugin to make it a bit neater.
 *
 * It uses type inference to look at `PluginDef`, identify its specific options schema, and return
 * the appropriate `PluginConfig`
 *
 * @template T A type that should extend `PluginDef`
 * @returns {PluginConfig<S> | never} The configuration type for the plugin, or never if invalid
 */
export type RegisterPlugin<T> = T extends PluginDef<infer S> ? PluginConfig<S> : never

/**
 * Constructor function to appease the TypeScript compiler
 *
 * @template {Record<string, SubOptionSchema>} T The plugin's map of suboptions, if any
 * @param plugin The plugin definition
 * @returns The same plugin definition
 */
export function createPlugin<T extends Record<string, SubOptionSchema>>(
  plugin: PluginDef<T>,
): PluginDef<T> {
  return plugin
}
