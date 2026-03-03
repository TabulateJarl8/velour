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
  <label class="label cursor-pointer gap-3 items-center mt-2 w-full">
    <div class="flex flex-col flex-1 hover:text-white transition-colors">
      <span class="label-text font-semibold">{{ opt.label }}</span>
      <span
        v-if="opt.description"
        class="label-text text-xs opacity-70 leading-4 whitespace-normal"
        :class="{ 'input-error': validationError }"
      >
        {{ opt.description }}
      </span>
    </div>
    <input type="checkbox" class="checkbox checkbox-sm checkbox-secondary" v-model="model" />
  </label>
</template>
