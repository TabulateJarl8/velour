
    import { createEssentialAppPlugin } from '@/core/types'

    const plugin = createEssentialAppPlugin(
      'curl',
      'Command-line tool for transferring data using various protocols with extensive options',
    )

    export default plugin

    declare module '@/core/registry' {
      interface PluginRegistry {
        'install-app-curl': import('@/core/types').RegisterPlugin<typeof plugin>
      }
    }
    