import { createPlugin, type InferPluginConfig } from '@/core/types'

const testPlugin = createPlugin({
  id: 'test-plugin',
  name: 'Test plugin',
  options: {
    option1: {
      label: 'This is option1',
      description: 'this is the desc',
      subOptions: {
        opt1: {
          type: 'text',
          label: 'sub1',
          description: 'sub1 desc',
        },
      },
    },
  },
  generate: function (
    _config: InferPluginConfig<{
      option1: {
        label: string
        description: string
        subOptions: { opt1: { type: 'text'; label: string; description: string } }
      }
    }>,
  ): string {
    return `echo 'helloworld'`
  },
})

export default testPlugin

type TestPlugin = InferPluginConfig<typeof testPlugin.options>
declare module '../core/registry' {
  interface PluginRegistry {
    'test-plugin': TestPlugin
  }
}
