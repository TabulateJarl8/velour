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
  <div class="border-base-300 bg-base-100 rounded-box collapse mb-4 border">
    <input type="checkbox" v-model="model.enabled" />

    <div class="collapse-title flex items-center gap-4">
      <input
        type="checkbox"
        :checked="model.enabled"
        class="checkbox checkbox-primary pointer-events-none"
        tabindex="-1"
      />
      <div>
        <h3 class="text-lg leading-tight font-bold">{{ plugin.name }}</h3>
        <p class="text-sm opacity-70">{{ plugin.description }}</p>
      </div>
    </div>

    <div v-if="Object.keys(plugin.options).length !== 0" class="collapse-content bg-base-200/50">
      <div class="flex flex-col pt-4">
        <div v-for="(opt, key) in plugin.options" :key="key" class="form-control w-full max-w-md">
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
        class="alert alert-soft mt-3"
        :class="alertClasses[alert.type]"
      >
        <span>{{ alert.message }}</span>
      </div>
    </div>
  </div>
</template>
