import type { PluginRegistry } from '@/core/registry'

export type Preset = {
  name: string
  config: {
    [K in keyof PluginRegistry]?: Partial<PluginRegistry[K]>
  }
}

export const presets: Preset[] = [
  {
    name: 'pro-preset',
    config: {
      'install-app-mc': {
        enabled: true,
      },
    },
  },
]
