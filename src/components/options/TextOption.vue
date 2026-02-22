<script setup lang="ts">
import type { TextSubOption } from '@/core/types'

const model = defineModel<string>({ required: true })
defineProps<{
  opt: TextSubOption
}>()
</script>

<template>
  <label class="label">
    <span class="label-text font-semibold">{{ opt.label }}</span>
  </label>
  <label class="label cursor-pointer justify-start gap-4">
    <input
      type="text"
      required
      class="input input-sm validator"
      v-model="model"
      :placeholder="opt['placeholder']"
    />
    <span class="label-text opacity-80">{{ opt.description }}</span>
  </label>
</template>
