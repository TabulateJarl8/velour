<script setup lang="ts">
import { computed } from 'vue'

import type { TextSubOption } from '@/core/types'

const model = defineModel<string>({ required: true })
const props = defineProps<{
  opt: TextSubOption
}>()

const validationError = computed(() => {
  if (!props.opt.validate) return false
  return typeof props.opt.validate(model.value) === 'string'
})
</script>

<template>
  <label
    class="label mt-2 flex w-full cursor-pointer flex-col items-start gap-3 sm:flex-row sm:items-center"
  >
    <div class="flex w-full shrink-0 flex-col transition-colors hover:text-white sm:w-[50%]">
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
    <input
      type="text"
      required
      class="input input-sm validator"
      :class="{ 'input-error': validationError }"
      v-model="model"
      :placeholder="opt.placeholder"
    />
  </label>
</template>
