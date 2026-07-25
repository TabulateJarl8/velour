import { describe, expect, it } from 'vitest'

import plugin from '../system/set-hostname'

describe('set-hostname', () => {
  it('rejects hostnames with invalid characters', () => {
    const badHostnames = ['WOW', 'w*4', '-wee']

    for (const bad of badHostnames) {
      expect(plugin.options.hostname.validate(bad)).toBeTypeOf('string')
    }
  })

  it('rejects hostnames that are too long', () => {
    const bad = 's'.repeat(255)
    expect(plugin.options.hostname.validate(bad)).toBeTypeOf('string')
  })

  it('rejects hostnames with parts that are too long', () => {
    const bad = 's'.repeat(64) + '.' + 's'
    expect(plugin.options.hostname.validate(bad)).toBeTypeOf('string')
  })

  it('accepts valid hostnames', () => {
    const hostnames = [
      'marbles',
      'xeep-4',
      'super.com.edu',
      's'.repeat(62) + '.' + 'femeral-artery',
    ]

    for (const hn of hostnames) {
      expect(plugin.options.hostname.validate(hn)).toBeUndefined()
    }
  })
})
