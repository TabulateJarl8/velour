/* eslint-disable @typescript-eslint/no-explicit-any */
import { PluginLoader } from '@/core/loader'
import type { SubOptionSchema } from '@/core/types'
import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'
import { shellcheck } from 'shellcheck'
import { config as shellcheckConfig } from 'shellcheck/build/configs/config.js'

interface CustomMatchers<R = unknown> {
  toBeValidBash: () => R
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Matchers<T = any> extends CustomMatchers<T> {}
}

expect.extend({
  toBeValidBash(content: string) {
    const result = spawnSync(shellcheckConfig.bin, ['-s', 'bash', '-'], {
      input: content,
      encoding: 'utf-8',
    })

    if (result.status === 0) {
      return {
        message: () => 'expected script not to be valid bash',
        pass: true,
      }
    } else {
      return {
        message: () => `expected script to be valid bash:\n${result.stdout}`,
        pass: false,
      }
    }
  },
})

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
    case 'radio':
      // every radio option selected once
      return suboption.options.map((opt) => opt.value)
    case 'text':
      if (suboption.default) return [suboption.default]
      return ['test_string']
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

  // download shellcheck
  await shellcheck({ args: ['--version'] })

  plugins.forEach((plugin) => {
    describe(`Plugin: ${plugin.id}`, () => {
      const configs = generatePermutations(plugin.options)

      it.each(configs)('valid bash with config: %j', (subOptions) => {
        const config = { enabled: true, ...subOptions }
        const output = plugin.generate(config)
        expect(output).toBeValidBash()
      })
    })
  })
})
