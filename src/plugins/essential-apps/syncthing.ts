
    import { createEssentialAppPlugin } from '@/core/types'

    const plugin = createEssentialAppPlugin(
      'syncthing',
      'Continuous file synchronization program for sharing files between devices securely',
    )

    export default plugin

    declare module '@/core/registry' {
      interface PluginRegistry {
        'install-app-syncthing': import('@/core/types').RegisterPlugin<typeof plugin>
      }
    }
    