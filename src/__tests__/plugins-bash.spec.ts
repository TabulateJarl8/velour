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

function getPossibleConfigValues(suboptions: SubOptionSchema): any[] {
  switch (suboptions.type) {
    case 'checkbox':
      // checkbox is true or false
      return [true, false]
    case 'radio':
      // every radio option selected once
      return suboptions.options.map((opt) => opt.value)
    case 'text':
      if (suboptions.default) return [suboptions.default]
      return ['test_string']
    case 'number':
      const possible: number[] = []
      if (suboptions.default !== undefined) possible.push(suboptions.default)
      if (suboptions.min !== undefined) possible.push(suboptions.min)
      if (suboptions.max !== undefined) possible.push(suboptions.max)

      // fallback
      if (possible.length === 0) possible.push(10)

      return [...new Set(possible)]
  }
}

function generatePermutations(options: Record<string, SubOptionSchema>): Record<string, any>[] {
  const keys = Object.keys(options)

  if (keys.length === 0) return [{}]

  const key = keys[0]!
  const remaining = keys.slice(1)
  const possible = getPossibleConfigValues(options[key]!)
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
