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
  <label class="label mt-2 w-full cursor-pointer items-center gap-3">
    <div class="flex flex-1 flex-col">
      <span
        class="label-text whitespace-normal"
        :class="opt.description ? 'text-base font-semibold' : 'text-sm font-medium'"
      >
        {{ opt.label }}
      </span>
      <span
        v-if="opt.description"
        class="label-text text-xs leading-4 whitespace-normal opacity-70"
      >
        {{ opt.description }}
      </span>
    </div>
  </label>

  <div class="flex flex-col gap-1.5 p-2">
    <label
      v-for="choice in opt.options"
      :key="choice.value"
      class="label cursor-pointer justify-start gap-4 whitespace-normal transition-colors hover:text-white"
    >
      <input
        type="radio"
        class="radio radio-sm radio-secondary"
        :class="{ 'radio-error': validationError }"
        v-model="model"
        :value="choice.value"
      />
      <span class="label-text">{{ choice.label }}</span>
    </label>
  </div>
</template>
