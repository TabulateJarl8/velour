<script setup lang="ts">
import type { NumberSubOption } from '@/core/types'
import { computed } from 'vue'

// may be a string because of the page converting on invalid input
const model = defineModel<number | string>({ required: true })
const props = defineProps<{
  opt: NumberSubOption
}>()

const snapMinMax = () => {
  if (
    model.value === undefined ||
    model.value === null ||
    model.value === '' ||
    Number.isNaN(Number(model.value))
  )
    return

  const numeric = Number(model.value)

  if (props.opt.max !== undefined && numeric > props.opt.max) {
    model.value = props.opt.max
  } else if (props.opt.min !== undefined && numeric < props.opt.min) {
    model.value = props.opt.min
  }
}

const preventNonNumericInput = (event: KeyboardEvent) => {
  // allow special keyboard input
  if (event.key.length > 1 || event.ctrlKey || event.metaKey) return

  if (!/^[0-9.-]$/.test(event.key)) event.preventDefault()
}

const validationError = computed(() => {
  if (!props.opt.validate) return false
  const parsedNum = Number(model.value)
  if (Number.isNaN(parsedNum)) return true
  return typeof props.opt.validate(parsedNum) === 'string'
})
</script>

<template>
  <label class="label cursor-pointer gap-3 items-center mt-2 w-full">
    <div class="flex flex-col flex-1 hover:text-white transition-colors">
      <span class="label-text font-semibold whitespace-normal">{{ opt.label }}</span>
      <span
        v-if="opt.description"
        class="label-text text-xs opacity-70 leading-4 whitespace-normal"
      >
        {{ opt.description }}
      </span>
    </div>
    <input
      type="number"
      required
      class="input input-sm validator text-center shrink-0"
      :class="{ 'input-error': validationError }"
      :style="{ width: `${String(opt.max || opt.placeholder || 999).length + 5}ch` }"
      v-model="model"
      :placeholder="opt['placeholder']"
      :min="opt['min']"
      :max="opt['max']"
      :step="opt['step']"
      @blur="snapMinMax"
      @keydown="preventNonNumericInput"
    />
  </label>
</template>
