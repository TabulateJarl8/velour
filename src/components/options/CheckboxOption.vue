<script setup lang="ts">
import type { UpdateOptionFn } from '@/composables/usePluginModel'
import type { CheckboxSubOption, ConcretePluginConfig } from '@/core/types'

const model = defineModel<ConcretePluginConfig>({ required: true })
defineProps<{
  opt: CheckboxSubOption
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
      type="checkbox"
      class="checkbox checkbox-sm checkbox-secondary"
      :checked="!!model[optionKey]"
      @change="(e) => onUpdate(optionKey, (e.target as HTMLInputElement).checked)"
    />
    <span class="label-text opacity-80">{{ opt.description }}</span>
  </label>
</template>
