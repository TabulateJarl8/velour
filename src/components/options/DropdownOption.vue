<script setup lang="ts">
import type { DropdownSubOption } from '@/core/types'
import { computed } from 'vue'

const model = defineModel<string>({ required: true })
const props = defineProps<{
  opt: DropdownSubOption
}>()

const validationError = computed(() => {
  if (!props.opt.validate) return false
  return typeof props.opt.validate(model.value) === 'string'
})
</script>

<template>
  <label class="label cursor-pointer gap-3 items-center mt-2 w-full">
    <div class="flex flex-col flex-1 hover:text-white transition-colors">
      <span class="label-text font-semibold">{{ opt.label }}</span>
      <span
        v-if="opt.description"
        class="label-text text-xs opacity-70 leading-4 whitespace-normal"
      >
        {{ opt.description }}
      </span>
    </div>

    <select
      class="select select-sm select-bordered"
      :class="{ 'input-error': validationError }"
      v-model="model"
    >
      <option disabled value="">Select an option</option>
      <option v-for="choice in opt.options" :key="choice.value" :value="choice.value">
        {{ choice.label }}
      </option>
    </select>
  </label>
</template>
