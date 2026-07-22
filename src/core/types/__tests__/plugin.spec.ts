import { describe, expect, it } from 'vitest'
import { createPlugin } from '../plugin'
import { createMockPlugin } from '../../../../tests/utils'

describe('createPlugin', () => {
  it('should return the exact plugin object passed to it', () => {
    const plugin = createMockPlugin('mock')
    const result = createPlugin(plugin)
    expect(result).toBe(plugin)
  })
})
