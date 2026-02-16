import { createPlugin } from '../core/types'

const plugin = createPlugin({
  id: 'test2',
  name: 'cool plugin',
  description: 'no',
  options: {},
  dependencies: ['test-plugin'],
  generate: (_config) => {
    return `# (cool plugin) script output here`
  },
})

export default plugin

declare module '../core/registry' {
  interface PluginRegistry {
    test2: import('@/core/types').RegisterPlugin<typeof plugin>
  }
}
