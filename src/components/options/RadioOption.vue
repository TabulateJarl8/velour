<script setup lang="ts">
import type { RadioSubOption } from '@/core/types'
import { computed } from 'vue'

const model = defineModel<string>({ required: true })
const props = defineProps<{
  opt: RadioSubOption
}>()

const validationError = computed(() => {
  if (!props.opt.validate) return false
  return typeof props.opt.validate(model.value) === 'string'
})
</script>

<template>
  <label class="label cursor-pointer gap-3 items-center mt-2 w-full">
    <div class="flex flex-col flex-1">
      <span class="label-text font-semibold">{{ opt.label }}</span>
      <span
        v-if="opt.description"
        class="label-text text-xs opacity-70 leading-4 whitespace-normal"
      >
        {{ opt.description }}
      </span>
    </div>
  </label>

  <div class="flex flex-col gap-1.5 p-2">
    <label
      v-for="choice in opt.options"
      :key="choice.value"
      class="label cursor-pointer justify-start gap-4 hover:text-white transition-colors"
      :class="{ 'input-error': validationError }"
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
</template>
