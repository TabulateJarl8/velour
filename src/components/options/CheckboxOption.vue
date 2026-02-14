<script setup lang="ts">
import type { CheckboxSubOption } from '@/core/types'

const model = defineModel<boolean>({ required: true })
defineProps<{
  opt: CheckboxSubOption
}>()
</script>

<template>
  <label class="label">
    <span class="label-text font-semibold">{{ opt.label }}</span>
  </label>
  <label class="label cursor-pointer justify-start gap-4">
    <input type="checkbox" class="checkbox checkbox-sm checkbox-secondary" v-model="model" />
    <span class="label-text opacity-80">{{ opt.description }}</span>
  </label>
</template>
