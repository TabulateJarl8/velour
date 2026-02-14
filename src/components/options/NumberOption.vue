<script setup lang="ts">
import type { NumberSubOption } from '@/core/types'

const model = defineModel<number>({ required: true })
defineProps<{
  opt: NumberSubOption
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
      v-model="model"
      :placeholder="opt['placeholder']"
      :min="opt['min']"
      :max="opt['max']"
    />
    <span class="label-text opacity-80">{{ opt.description }}</span>
  </label>
</template>
