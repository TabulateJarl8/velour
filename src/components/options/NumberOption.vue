<script setup lang="ts">
import type { NumberSubOption } from '@/core/types'

const model = defineModel<number>({ required: true })
const props = defineProps<{
  opt: NumberSubOption
}>()

const snapMinMax = () => {
  if (model.value === undefined || model.value === null) return

  if (props.opt.max !== undefined && model.value > props.opt.max) {
    model.value = props.opt.max
  } else if (props.opt.min !== undefined && model.value < props.opt.min) {
    model.value = props.opt.min
  }
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
    />
    <span class="label-text opacity-80">{{ opt.description }}</span>
  </label>
</template>
