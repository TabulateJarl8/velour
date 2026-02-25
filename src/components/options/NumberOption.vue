<script setup lang="ts">
import type { NumberSubOption } from '@/core/types'

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
</script>

<template>
  <label class="label">
    <span class="label-text font-semibold">{{ opt.label }}</span>
  </label>
  <label class="label cursor-pointer justify-start gap-4">
    <!-- set the width to either the max length, placeholder length, or default to 3 -->
    <input
      type="number"
      required
      class="input input-sm validator text-center"
      :style="{ width: `${String(opt.max || opt.placeholder || 999).length + 5}ch` }"
      v-model="model"
      :placeholder="opt['placeholder']"
      :min="opt['min']"
      :max="opt['max']"
      :step="opt['step']"
      @blur="snapMinMax"
      @keydown="preventNonNumericInput"
    />
    <span class="label-text opacity-80">{{ opt.description }}</span>
  </label>
</template>
