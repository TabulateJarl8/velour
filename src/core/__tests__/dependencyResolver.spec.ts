import { describe, expect, it, vi } from 'vitest'
import type { ConcretePluginDef } from '../types'
import { createMockPlugin } from '../../../tests/utils'
import { resolveEnabledPlugins, sortPlugins } from '../dependencyResolver'
import { logger } from '../logger'

describe('dependencyResolver', () => {
  describe('resolveEnabledPlugins', () => {
    it('resolves simple dependencies', () => {
      const plugins: ConcretePluginDef[] = [
        createMockPlugin('mock-plugin', { dependencies: ['mock-dependency' as never] }),
        createMockPlugin('mock-dependency'),
      ]
      const configs = { 'mock-plugin': { enabled: true }, 'mock-dependency': { enabled: false } }

      // mock dependency should be enabled after resolution
      const enabledPlugins = resolveEnabledPlugins(plugins, configs)
      expect(enabledPlugins).toContain('mock-plugin')
      expect(enabledPlugins).toContain('mock-dependency')
      expect(enabledPlugins.size).toBe(2)
    })

    it('resolves circular dependencies', () => {
      const spy = vi.spyOn(logger, 'warning').mockImplementation(() => {})
      const plugins: ConcretePluginDef[] = [
        createMockPlugin('mock-plugin', { dependencies: ['mock-dependency' as never] }),
        createMockPlugin('mock-dependency', { dependencies: ['mock-plugin' as never] }),
      ]
      const configs = { 'mock-plugin': { enabled: true }, 'mock-dependency': { enabled: true } }

      // this should not result in an infinite loop
      const enabledPlugins = resolveEnabledPlugins(plugins, configs)
      expect(enabledPlugins).toContain('mock-plugin')
      expect(enabledPlugins).toContain('mock-dependency')
      expect(enabledPlugins.size).toBe(2)

      spy.mockRestore()
    })

    it('resolves with no dependencies', () => {
      const plugins: ConcretePluginDef[] = [
        createMockPlugin('mock-plugin', { dependencies: [] }),
        createMockPlugin('mock-dependency'),
      ]
      const configs = { 'mock-plugin': { enabled: true }, 'mock-dependency': { enabled: false } }

      // only 1 dependency should be resolved
      const enabledPlugins = resolveEnabledPlugins(plugins, configs)
      expect(enabledPlugins).toContain('mock-plugin')
      expect(enabledPlugins).not.toContain('mock-dependency')
      expect(enabledPlugins.size).toBe(1)
    })

    it('resolves complex dependencies', () => {
      // dependency tree:
      // A -> B & C
      // B -> D
      // C -> D & B
      // D
      // E (unused)
      const plugins: ConcretePluginDef[] = [
        createMockPlugin('a', { dependencies: ['b' as never, 'c' as never] }),
        createMockPlugin('b', { dependencies: ['d' as never] }),
        createMockPlugin('c', { dependencies: ['d' as never, 'b' as never] }),
        createMockPlugin('d', { dependencies: [] }),
        createMockPlugin('e', { dependencies: [] }),
      ]
      const configs = {
        a: { enabled: true },
        b: { enabled: false },
        c: { enabled: false },
        d: { enabled: false },
        e: { enabled: false },
      }

      const enabledPlugins = resolveEnabledPlugins(plugins, configs)

      // a was explicitely enabled
      expect(enabledPlugins).toContain('a')

      // b should only be resolved from A, not C
      expect(enabledPlugins).toContain('b')

      // c is enabled from A
      expect(enabledPlugins).toContain('c')

      // b enabled dD
      expect(enabledPlugins).toContain('d')

      // nothing enabled e
      expect(enabledPlugins).not.toContain('e')
      expect(enabledPlugins.size).toBe(4)
    })
  })

  describe('sortPlugins', () => {
    it('works with an empty list', () => {
      const sorted = sortPlugins([])
      expect(sorted.length).toBe(0)
    })

    it('works with one plugin', () => {
      const plugins: ConcretePluginDef[] = [createMockPlugin('mock-plugin')]
      const sorted = sortPlugins(plugins)
      expect(sorted.length).toBe(1)
    })

    it('works with simple dependencies', () => {
      const plugins: ConcretePluginDef[] = [
        createMockPlugin('a', { dependencies: ['c' as never] }),
        createMockPlugin('b', { dependencies: ['a' as never] }),
        createMockPlugin('c'),
      ]
      const sorted = sortPlugins(plugins)
      expect(sorted.length).toBe(3)

      // c has no dependencies, it should come first
      expect(sorted[0]!.id).toBe('c')
      // b depends on a which depends on c, so a is in the middle
      expect(sorted[1]!.id).toBe('a')
      // b only depends on a so it goes last
      expect(sorted[2]!.id).toBe('b')
    })

    it('works with circular dependencies', () => {
      const spy = vi.spyOn(logger, 'warning').mockImplementation(() => {})
      const plugins: ConcretePluginDef[] = [
        createMockPlugin('a', { dependencies: ['b' as never] }),
        createMockPlugin('b', { dependencies: ['c' as never] }),
        createMockPlugin('c', { dependencies: ['a' as never] }),
      ]
      const sorted = sortPlugins(plugins)
      expect(sorted.length).toBe(3)

      // should end up in reverse order since thats the way the dependencies
      // are shaped
      expect(sorted[0]!.id).toBe('c')
      expect(sorted[1]!.id).toBe('b')
      expect(sorted[2]!.id).toBe('a')

      spy.mockRestore()
    })

    it('keeps the order with no dependencies', () => {
      const plugins: ConcretePluginDef[] = [
        createMockPlugin('a'),
        createMockPlugin('b'),
        createMockPlugin('c'),
      ]
      const sorted = sortPlugins(plugins)
      expect(sorted.length).toBe(3)

      expect(sorted[0]!.id).toBe('a')
      expect(sorted[1]!.id).toBe('b')
      expect(sorted[2]!.id).toBe('c')
    })

    it('handles undefined dependencies', () => {
      const plugins: ConcretePluginDef[] = [
        createMockPlugin('a', { dependencies: ['bad' as never] }),
      ]
      const sorted = sortPlugins(plugins)
      expect(sorted.length).toBe(1)

      expect(sorted[0]!.id).toBe('a')
    })
  })
})
