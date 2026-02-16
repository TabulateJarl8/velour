import { Categories, createPlugin } from '@/core/types'

const testPlugin = createPlugin({
  id: 'test-plugin',
  name: 'Test plugin',
  description: 'desc',
  options: {
    opt1: {
      type: 'text',
      label: 'sub1',
      description: 'sub1 desc',
      default: 'test',
    },
    opt2: {
      type: 'checkbox',
      label: 'sub1',
      description: 'sub1 desc',
      default: false,
    },
    opt3: {
      type: 'number',
      label: 'sub1',
      description: 'sub1 desc',
      default: 3,
      placeholder: 'number',
      min: 4,
      max: 7,
    },
    opt4: {
      type: 'radio',
      label: 'sub1',
      description: 'sub1 desc',
      options: [
        { label: 'rad1', value: 'rad1' },
        { label: 'rad2', value: 'rad2' },
        { label: 'rad3', value: 'rad3' },
      ],
      default: 'rad1',
    },
  },
  category: Categories.System,
  dependencies: ['test2'],
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
