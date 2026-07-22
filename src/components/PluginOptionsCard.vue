<script setup lang="ts">
import type { ConcretePluginConfig, ConcretePluginDef, PluginAlert } from '@/core/types'
import CheckboxOption from './options/CheckboxOption.vue'
import TextOption from './options/TextOption.vue'
import NumberOption from './options/NumberOption.vue'
import RadioOption from './options/RadioOption.vue'
import DropdownOption from './options/DropdownOption.vue'
import { computed } from 'vue'

const model = defineModel<ConcretePluginConfig>({ required: true })
const componentMap: Record<string, unknown> = {
  checkbox: CheckboxOption,
  text: TextOption,
  number: NumberOption,
  radio: RadioOption,
  dropdown: DropdownOption,
}

const props = defineProps<{
  plugin: ConcretePluginDef
}>()

const alert = computed<PluginAlert | undefined>(() => {
  return props.plugin.alerts ? props.plugin.alerts(model.value) : undefined
})

// workaround so that tailwind includes the class names
const alertClasses: Record<string, string> = {
  info: 'alert-info',
  warning: 'alert-warning',
  success: 'alert-success',
  error: 'alert-error',
}
</script>

<template>
  <div
    class="border-base-300 bg-base-200 hover:border-primary/40 has-focus-visible:ring-primary/70 collapse border outline-none has-focus-visible:ring-2"
  >
    <input type="checkbox" v-model="model.enabled" />

    <div class="collapse-title flex items-start gap-4 p-4">
      <input
        type="checkbox"
        :checked="model.enabled"
        class="checkbox checkbox-sm checkbox-primary pointer-events-none mt-0.75"
        tabindex="-1"
      />
      <div>
        <h3 class="text-sm leading-tight font-semibold" :class="{ 'text-primary': model.enabled }">
          {{ plugin.name }}
        </h3>
        <p class="text-base-content/60 mt-1 text-xs leading-relaxed">
          {{ plugin.description }}
        </p>
      </div>
    </div>

    <div v-if="Object.keys(plugin.options).length !== 0 || alert" class="collapse-content">
      <div class="divider mt-0 mb-1"></div>

      <div v-if="Object.keys(plugin.options).length !== 0" class="flex flex-col gap-1">
        <div v-for="(opt, key) in plugin.options" :key="key" class="form-control">
          <component
            :is="componentMap[opt.type]"
            v-model="model[key as keyof ConcretePluginConfig]!"
            :opt="opt"
          />
        </div>
      </div>

      <div
        v-if="alert"
        role="alert"
        class="alert alert-soft mt-4 flex items-start gap-3 text-xs"
        :class="alertClasses[alert.type]"
      >
        <i-heroicons-exclamation-triangle
          v-if="alert.type === 'warning'"
          class="mt-0.75 size-5 shrink-0 stroke-current"
        />
        <i-heroicons-exclamation-circle
          v-else-if="alert.type === 'error'"
          class="mt-0.5 size-5 shrink-0 stroke-current"
        />
        <i-heroicons-information-circle
          v-else-if="alert.type === 'info'"
          class="mt-0.5 size-5 shrink-0 stroke-current"
        />
        <i-heroicons-check-badge v-else class="mt-0.5 size-5 shrink-0 stroke-current" />
        <span class="leading-relaxed">{{ alert.message }}</span>
      </div>
    </div>
  </div>
</template>
