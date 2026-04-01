/* eslint-disable @typescript-eslint/no-explicit-any */
import { PluginLoader } from '@/core/loader'
import { buildSinglePluginScript } from '@/core/scriptGenerator'
import type { ConcretePluginConfig, SubOptionSchema } from '@/core/types'
import { describe, expect, it } from 'vitest'

/**
 * Given a suboption, generate the possible variants of it
 *
 * @param suboption The suboption
 * @returns A list of all the variants of the suboption to test
 */
function getPossibleSuboptionVariants(suboption: SubOptionSchema): any[] {
  switch (suboption.type) {
    case 'checkbox':
      // checkbox is true or false
      return [true, false]
    case 'dropdown':
    case 'radio':
      // every radio or dropdown option selected once
      return suboption.options.map((opt) => opt.value)
    case 'text':
      // test for invalid input
      const invalid_input = ['\\', '"']

      if (suboption.default) return [suboption.default, ...invalid_input]
      return ['test_string', ...invalid_input]
    case 'number':
      const possible: number[] = []
      if (suboption.default !== undefined) possible.push(suboption.default)
      if (suboption.min !== undefined) possible.push(suboption.min)
      if (suboption.max !== undefined) possible.push(suboption.max)

      // fallback
      if (possible.length === 0) possible.push(10)

      return [...new Set(possible)]
  }
}

/**
 * Generate all possible permutations of a plugin config.
 *
 * @param options The plugin's options
 * @returns An array of every possible permutation of the options
 */
function generatePermutations(options: Record<string, SubOptionSchema>): Record<string, any>[] {
  const keys = Object.keys(options)

  if (keys.length === 0) return [{}]

  const key = keys[0]!
  const remaining = keys.slice(1)
  const possible = getPossibleSuboptionVariants(options[key]!)
  const remainingPermutations = generatePermutations(
    Object.fromEntries(remaining.map((k) => [k, options[k]!])),
  )

  const permutations: Record<string, any>[] = []

  for (const value of possible) {
    for (const config of remainingPermutations) {
      permutations.push({ [key]: value, ...config })
    }
  }

  return permutations
}

describe('Plugin Bash Validity', async () => {
  const loader = new PluginLoader()
  const pluginMap = await loader.loadPlugins(true)
  const plugins = Array.from(pluginMap.values())

  plugins.forEach((plugin) => {
    describe(`Plugin: ${plugin.id}`, () => {
      const configs = generatePermutations(plugin.options)

      it.each(configs)('valid bash with config: %j', (subOptions) => {
        const config = { enabled: true, ...subOptions } as ConcretePluginConfig

        let hasError = false
        for (const [key, opt] of Object.entries(plugin.options)) {
          if (opt.validate) {
            // WARN: this will break if the validate signature changes
            // TODO: can i fulled type this
            const validate = opt.validate as (value: any) => true | string | undefined
            const result = validate(config[key])
            if (typeof result === 'string') {
              hasError = true
              break
            }
          }
        }

        const output = buildSinglePluginScript(plugin, config, hasError, false)
        expect(output).toBeValidBash()
      })
    })
  })
})
