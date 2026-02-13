import { createPlugin } from '@/core/types'

const testPlugin = createPlugin({
  id: 'test-plugin',
  name: 'Test plugin',
  options: {
    opt1: {
      type: 'text',
      label: 'sub1',
      description: 'sub1 desc',
      default: 'test',
    },
  },
  generate: function (_config): string {
    return `echo 'helloworld'`
  },
})

export default testPlugin

declare module '../core/registry' {
  interface PluginRegistry {
    'test-plugin': import('@/core/types').RegisterPlugin<typeof testPlugin>
  }
}
