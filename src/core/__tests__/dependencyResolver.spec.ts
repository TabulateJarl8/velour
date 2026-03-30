import { describe, expect, it } from 'vitest'
import type { ConcretePluginDef } from '../types'
import { createMockPlugin } from '../../../tests/utils'
import { resolveEnabledPlugins } from '../dependencyResolver'

describe('Dependency Resolver', () => {
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
