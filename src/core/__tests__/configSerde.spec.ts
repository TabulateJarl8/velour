import { createMockPlugin } from '../../../tests/utils'
import { deserializeConfig, extractPayloadFromScript, serializeConfig } from './../configSerde'
import { describe, expect, it } from 'vitest'

describe('configSerde', () => {
  describe('serde', () => {
    it('serializes a config with no plugins', async () => {
      const result = await serializeConfig([], {}, false)
      const decoded = await deserializeConfig(result)
      expect(decoded).toEqual({ configs: {} })
    })

    it('serializes an empty config', async () => {
      const plugin = createMockPlugin('mock')
      const result = await serializeConfig([plugin], { mock: { enabled: false } }, false)
      const decoded = await deserializeConfig(result)
      expect(decoded).toEqual({ configs: {} })
    })

    it('serializes a config with only defaults', async () => {
      const plugin = createMockPlugin('mock', {
        options: {
          opt1: { type: 'checkbox', label: 'fun', default: true },
          opt2: { type: 'text', label: 'mock', required: false, default: 'default' },
        },
      })

      const config = { mock: { enabled: true, opt1: true, opt2: 'default' } }

      const result = await serializeConfig([plugin], config, false)
      const decoded = await deserializeConfig(result)

      expect(decoded.configs).toEqual({ mock: { enabled: true } })
      expect(decoded.quietMode).toBeUndefined()
    })

    it('serializes a config with options changed', async () => {
      const plugin = createMockPlugin('mock', {
        options: {
          opt1: { type: 'checkbox', label: 'fun', default: true },
          opt2: { type: 'text', label: 'mock', required: false, default: 'default' },
        },
      })

      const config = { mock: { enabled: true, opt1: false, opt2: 'change' } }

      const result = await serializeConfig([plugin], config, true)
      const decoded = await deserializeConfig(result)

      expect(decoded.configs).toEqual(config)
      expect(decoded.quietMode).toBe(true)
    })

    it('ignores configs from nonexistent plugins', async () => {
      const config = { mock: { enabled: true, opt1: false } }
      const result = await serializeConfig([], config, false)
      const decoded = await deserializeConfig(result)

      expect(decoded).toEqual({ configs: {} })
    })

    it('falls back default when option has none', async () => {
      const plugin = createMockPlugin('mock', {
        options: {
          opt: { type: 'text', label: 'mock', required: false },
        },
      })

      const config = { mock: { enabled: true, opt: 'change' } }

      const result = await serializeConfig([plugin], config, false)
      const decoded = await deserializeConfig(result)

      expect(decoded.configs).toEqual(config)
    })
  })

  describe('extractPayloadFromScript', () => {
    it('returns null for empty scripts', () => {
      const payload = extractPayloadFromScript('')
      expect(payload).toBeNull()
    })

    it('returns null for non-matches', () => {
      const payload = extractPayloadFromScript('test\ntest2\ntest3')
      expect(payload).toBeNull()
    })

    it('returns null for empty value', () => {
      const payload = extractPayloadFromScript('test\ntest2\n# VELOUR_CONFIG_STATE=')
      expect(payload).toBeNull()
    })

    it('returns the script value', () => {
      const payloadString = Math.random().toString(36).substring(2, 13)
      const payload = extractPayloadFromScript(
        `test\ntest2\n# VELOUR_CONFIG_STATE=${payloadString}`,
      )
      expect(payload).toEqual(payloadString)
    })

    it('returns the script value with empty lines at the end', () => {
      const payloadString = Math.random().toString(36).substring(2, 13)
      const payload = extractPayloadFromScript(
        `test\ntest2\n# VELOUR_CONFIG_STATE=${payloadString}\n\n\n`,
      )
      expect(payload).toEqual(payloadString)
    })
  })
})
