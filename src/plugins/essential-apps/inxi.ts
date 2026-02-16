
    import { createEssentialAppPlugin } from '@/core/types'

    const plugin = createEssentialAppPlugin(
      'inxi',
      'Command-line system information tool for hardware, CPU, drivers, and more',
    )

    export default plugin

    declare module '@/core/registry' {
      interface PluginRegistry {
        'install-app-inxi': import('@/core/types').RegisterPlugin<typeof plugin>
      }
    }
    