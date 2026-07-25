import { describe, expect, it } from 'vitest'

import { createMockPlugin } from '../../../../tests/utils'
import { createPlugin } from '../plugin'

describe('createPlugin', () => {
  it('should return the exact plugin object passed to it', () => {
    const plugin = createMockPlugin('mock')
    const result = createPlugin(plugin)
    expect(result).toBe(plugin)
  })
})
