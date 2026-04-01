import { PluginLoader } from '../loader'
import { expect, it, vi } from 'vitest'
import { describe } from 'vitest'
import { createMockPlugin } from '../../../tests/utils'
import { logger } from '../logger'

describe('PluginLoader', () => {
  describe('loadPlugins', () => {
    it('loads valid plugins in quiet mode', async () => {
      const spy = vi.spyOn(logger, 'info').mockImplementation(() => {})

      const mockPlugin = createMockPlugin('mock-empty-plugin')
      const mockProvider = vi.fn().mockResolvedValue({
        '../plugins/test.ts': { default: mockPlugin },
      })
      const loader = new PluginLoader(mockProvider)

      const plugins = await loader.loadPlugins(true)

      expect(plugins.size).toBe(1)
      expect(plugins.get('mock-empty-plugin')).toEqual(mockPlugin)
      expect(spy).not.toHaveBeenCalled()

      spy.mockRestore()
    })

    it('loads valid plugins in verbose mode', async () => {
      const spy = vi.spyOn(logger, 'info').mockImplementation(() => {})

      const mockPlugin = createMockPlugin('mock-empty-plugin')
      const mockProvider = vi.fn().mockResolvedValue({
        '../plugins/test.ts': { default: mockPlugin },
      })
      const loader = new PluginLoader(mockProvider)

      const plugins = await loader.loadPlugins(false)

      expect(plugins.size).toBe(1)
      expect(plugins.get('mock-empty-plugin')).toEqual(mockPlugin)
      expect(spy).toHaveBeenCalled()

      spy.mockRestore()
    })

    it('ignored invalid plugins', async () => {
      const mockProvider = vi.fn().mockResolvedValue({
        '../plugins/empty.ts': { default: {} },
        '../plugins/null.ts': { default: null },
        '../plugins/missing.ts': {},
        '../plugins/bad-type.ts': { default: true },
      })
      const loader = new PluginLoader(mockProvider)

      const plugins = await loader.loadPlugins(true)

      expect(plugins.size).toBe(0)
    })

    it('uses the default provider when not provided one', async () => {
      const loader = new PluginLoader()
      const plugins = await loader.loadPlugins(true)

      expect(plugins.size).toBeGreaterThan(0)
    })
  })

  describe('getPlugins', () => {
    it('returns an array of plugins', async () => {
      const mockPluginA = createMockPlugin('a')
      const mockPluginB = createMockPlugin('b')
      const mockProvider = vi.fn().mockResolvedValue({
        '../plugins/a.ts': { default: mockPluginA },
        '../plugins/b.ts': { default: mockPluginB },
      })
      const loader = new PluginLoader(mockProvider)
      await loader.loadPlugins(true)

      const plugins = loader.getPlugins()

      expect(plugins.length).toBe(2)
      expect(plugins).instanceOf(Array)
      expect(plugins).toContain(mockPluginA)
      expect(plugins).toContain(mockPluginB)
    })
  })

  describe('initializePluginConfig', () => {
    it('inits config with defaults', () => {
      const plugin = createMockPlugin('mock', {
        options: {
          opt1: { type: 'checkbox', label: 'test', default: true },
          opt2: { type: 'text', label: 'test', required: false, default: 'default text' },
        },
      })

      const config = PluginLoader.initializePluginConfig(plugin)

      expect(config).toEqual({ enabled: false, opt1: true, opt2: 'default text' })
    })

    it('inits config using SUB_OPTION_DEFAULTS', () => {
      const plugin = createMockPlugin('mock', {
        options: {
          num: { type: 'number', label: 'test' },
          text: { type: 'text', label: 'test', required: true },
          check: { type: 'checkbox', label: 'test' },
        },
      })

      const config = PluginLoader.initializePluginConfig(plugin)

      expect(config).toEqual({ enabled: false, num: 0, text: '', check: false })
    })
  })
})
