<script setup lang="ts">
import type { CheckboxSubOption } from '@/core/types'
import { computed } from 'vue'

const model = defineModel<boolean>({ required: true })
const props = defineProps<{
  opt: CheckboxSubOption
}>()

const validationError = computed(() => {
  if (!props.opt.validate) return false
  return typeof props.opt.validate(model.value) === 'string'
})
</script>

<template>
  <label class="label mt-2 w-full cursor-pointer items-center gap-3">
    <div class="flex flex-1 flex-col transition-colors hover:text-white">
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
      type="checkbox"
      class="checkbox checkbox-sm checkbox-secondary"
      :class="{ 'checkbox-error': validationError }"
      v-model="model"
    />
  </label>
</template>
