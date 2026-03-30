import type { ConcretePluginDef } from '@/core/types'

/**
 * Create a mock plugin with provided setting overrides
 *
 * @param id The plugin's ID
 * @param overrides The setting overrides
 * @returns A conrete plugin definition
 */
export function createMockPlugin(
  id: string,
  overrides?: Partial<ConcretePluginDef>,
): ConcretePluginDef {
  return {
    id,
    name: 'mock plugin',
    description: 'mock plugin',
    preRunMessage: 'Prerun...',
    category: 'System Configuration',
    options: {},
    generate: () => '# mock plugin',
    ...overrides,
  } as ConcretePluginDef
}
