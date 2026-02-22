<script setup lang="ts">
import type { ConcretePluginConfig, ConcretePluginDef } from '@/core/types'
import CheckboxOption from './options/CheckboxOption.vue'
import TextOption from './options/TextOption.vue'
import NumberOption from './options/NumberOption.vue'
import RadioOption from './options/RadioOption.vue'

const model = defineModel<ConcretePluginConfig>({ required: true })
const componentMap: Record<string, unknown> = {
  checkbox: CheckboxOption,
  text: TextOption,
  number: NumberOption,
  radio: RadioOption,
}

defineProps<{
  plugin: ConcretePluginDef
}>()
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
      <div class="flex flex-col gap-4 py-4">
        <div v-for="(opt, key) in plugin.options" :key="key" class="form-control w-full max-w-md">
          <component
            :is="componentMap[opt.type]"
            v-model="model[key as keyof ConcretePluginConfig]!"
            :opt="opt"
          />
        </div>
      </div>
    </div>
  </div>
</template>
