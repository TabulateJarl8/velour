<script setup lang="ts">
import type { CheckboxSubOption } from '@/core/types'

const model = defineModel<boolean>({ required: true })
defineProps<{
  opt: CheckboxSubOption
}>()
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
    <input type="checkbox" class="checkbox checkbox-sm checkbox-secondary" v-model="model" />
  </label>
</template>
