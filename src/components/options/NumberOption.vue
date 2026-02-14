<script setup lang="ts">
import type { UpdateOptionFn } from '@/composables/usePluginModel'
import type { ConcretePluginConfig, NumberSubOption } from '@/core/types'

const model = defineModel<ConcretePluginConfig>({ required: true })
defineProps<{
  opt: NumberSubOption
  optionKey: keyof ConcretePluginConfig
  onUpdate: UpdateOptionFn
}>()
</script>

<template>
  <label class="label">
    <span class="label-text font-semibold">{{ opt.label }}</span>
  </label>
  <label class="label cursor-pointer justify-start gap-4">
    <input
      type="number"
      required
      class="input input-sm"
      :value="model[optionKey]"
      :placeholder="opt['placeholder']"
      :min="opt['min']"
      :max="opt['max']"
      @change="(e) => onUpdate(optionKey, (e.target as HTMLInputElement).value)"
    />
    <span class="label-text opacity-80">{{ opt.description }}</span>
  </label>
</template>
