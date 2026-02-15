<script setup lang="ts">
import type { RadioSubOption } from '@/core/types'

const model = defineModel<string>({ required: true })
defineProps<{
  opt: RadioSubOption
}>()
</script>

<template>
  <label class="label">
    <span class="label-text font-semibold">{{ opt.label }}</span>
  </label>
  <div class="flex flex-col gap-1 pl-1">
    <label
      v-for="choice in opt.options"
      :key="choice.value"
      class="label cursor-pointer justify-start gap-4"
    >
      <input
        type="radio"
        class="radio radio-sm radio-secondary"
        v-model="model"
        :value="choice.value"
      />
      <span class="label-text">{{ choice.label }}</span>
    </label>
  </div>
  <label class="label">
    <span class="label-text opacity-80">{{ opt.description }}</span>
  </label>
</template>
