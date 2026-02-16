
    import { createEssentialAppPlugin } from '@/core/types'

    const plugin = createEssentialAppPlugin(
      'tilix',
      'Tiling terminal emulator with advanced features like split panes and session management',
    )

    export default plugin

    declare module '@/core/registry' {
      interface PluginRegistry {
        'install-app-tilix': import('@/core/types').RegisterPlugin<typeof plugin>
      }
    }
    