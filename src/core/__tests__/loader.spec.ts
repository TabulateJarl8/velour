import { PluginLoader } from '../loader'
import { expect, it, vi } from 'vitest'
import { describe } from 'vitest'
import type { ConcretePluginDef } from '../types'

const mockEmptyPlugin: ConcretePluginDef = {
  id: 'mock-empty-plugin',
  name: 'Mock Empty Testing Plugin',
  description: 'Mock Plugin',
  options: {},
  generate: () => 'mock-empty',
}

describe('PluginLoader', () => {
  it('loads valid plugins', async () => {
    const mockProvider = vi.fn().mockResolvedValue({
      '../plugins/test.ts': () => Promise.resolve({ default: mockEmptyPlugin }),
    })
    const loader = new PluginLoader(mockProvider)

    const plugins = await loader.loadPlugins(true)

    expect(plugins.size).toBe(1)
    expect(plugins.get('mock-empty-plugin')).toEqual(mockEmptyPlugin)
  })

  it('ignored invalid plugins', async () => {
    const mockProvider = vi.fn().mockResolvedValue({
      '../plugins/bad.ts': () => Promise.resolve({ default: {} }),
    })
    const loader = new PluginLoader(mockProvider)

    const plugins = await loader.loadPlugins(true)

    expect(plugins.size).toBe(0)
  })
})
