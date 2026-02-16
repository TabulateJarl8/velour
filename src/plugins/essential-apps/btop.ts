
    import { createEssentialAppPlugin } from '@/core/types'

    const plugin = createEssentialAppPlugin(
      'btop',
      'Resource monitor that shows usage and stats for processor, memory, disks, network and processes',
    )

    export default plugin

    declare module '@/core/registry' {
      interface PluginRegistry {
        'install-app-btop': import('@/core/types').RegisterPlugin<typeof plugin>
      }
    }
    