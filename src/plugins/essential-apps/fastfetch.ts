
    import { createEssentialAppPlugin } from '@/core/types'

    const plugin = createEssentialAppPlugin(
      'fastfetch',
      'Quick system information tool that displays OS, kernel, uptime, and more',
    )

    export default plugin

    declare module '@/core/registry' {
      interface PluginRegistry {
        'install-app-fastfetch': import('@/core/types').RegisterPlugin<typeof plugin>
      }
    }
    