<script setup lang="ts">
import type { TextSubOption } from '@/core/types'
import { computed } from 'vue'

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
    class="label cursor-pointer gap-3 mt-2 w-full flex flex-col sm:flex-row items-start sm:items-center"
  >
    <div class="flex flex-col w-full sm:w-[50%] shrink-0 hover:text-white transition-colors">
      <span class="label-text font-semibold whitespace-normal">{{ opt.label }}</span>
      <span
        v-if="opt.description"
        class="label-text text-xs opacity-70 leading-4 whitespace-normal"
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
