import type { ConcretePluginConfig } from '@/core/types'
import type { ModelRef } from 'vue'

export type UpdateOptionFn = <K extends keyof ConcretePluginConfig>(
  key: K,
  value: ConcretePluginConfig[K],
) => void

export function usePluginModel(model: ModelRef<ConcretePluginConfig>): {
  updateOption: UpdateOptionFn
} {
  function updateOption<K extends keyof ConcretePluginConfig>(
    key: K,
    value: ConcretePluginConfig[K],
  ) {
    model.value = {
      ...model.value,
      [key]: value,
    }
  }
  return { updateOption }
}
