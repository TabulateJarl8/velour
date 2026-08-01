import { describe, expect, it, vi } from 'vitest'

import { PluginLoader } from '../loader'

describe('Plugin Registry', () => {
  it('check that plugins do not override each other', async () => {
    const loader = new PluginLoader()

    const registered = new Set<string>()
    const duplicate: string[] = []

    const pluginsMap = loader['plugins'] as Map<string, unknown>

    const originalSet = pluginsMap.set.bind(pluginsMap)

    const setSpy = vi.spyOn(pluginsMap, 'set').mockImplementation((key, value) => {
      if (registered.has(key)) {
        duplicate.push(key)
      }
      registered.add(key)
      return originalSet(key, value)
    })

    try {
      await loader.loadPlugins(true)

      expect(duplicate).toEqual([])
    } finally {
      setSpy.mockRestore()
    }
  })
})
