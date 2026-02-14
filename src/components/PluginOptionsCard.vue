<script setup lang="ts">
import { usePluginModel } from '@/composables/usePluginModel'
import type { ConcretePluginConfig, ConcretePluginDef } from '@/core/types'
import CheckboxOption from './options/CheckboxOption.vue'
import TextOption from './options/TextOption.vue'
import NumberOption from './options/NumberOption.vue'

const model = defineModel<ConcretePluginConfig>({ required: true })
const { updateOption } = usePluginModel(model)

defineProps<{
  plugin: ConcretePluginDef
}>()

function togglePlugin(e: Event) {
  const isChecked = (e.target as HTMLInputElement).checked
  updateOption('enabled', isChecked)
}
</script>

<template>
  <div class="collapse border border-base-300 bg-base-100 rounded-box mb-4">
    <input type="checkbox" :checked="model.enabled" @change="togglePlugin" />

    <div class="collapse-title flex items-center gap-4">
      <input
        type="checkbox"
        :checked="model.enabled"
        class="checkbox checkbox-primary pointer-events-none"
        tabindex="-1"
      />
      <div>
        <h3 class="font-bold text-lg leading-tight">{{ plugin.name }}</h3>
        <p class="text-sm opacity-70">{{ plugin.description }}</p>
      </div>
    </div>

    <div class="collapse-content bg-base-200/50">
      <div class="py-4 flex flex-col gap-4">
        <div v-for="(opt, key) in plugin.options" :key="key" class="form-control w-full max-w-md">
          <CheckboxOption
            v-if="opt.type === 'checkbox'"
            v-model="model"
            :opt="opt"
            :option-key="key"
            :on-update="updateOption"
          />
          <TextOption
            v-if="opt.type === 'text'"
            v-model="model"
            :opt="opt"
            :option-key="key"
            :on-update="updateOption"
          />
          <NumberOption
            v-if="opt.type === 'number'"
            v-model="model"
            :opt="opt"
            :option-key="key"
            :on-update="updateOption"
          />
        </div>
      </div>
    </div>
  </div>
</template>
