<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PluginLoader } from './core/loader'
import type { ConcretePluginConfig, ConcretePluginDef } from './core/types'
import PluginOptionsCard from './components/PluginOptionsCard.vue'
import { resolveEnabledPlugins, sortPlugins } from './core/dependencyResolver'

const loader = new PluginLoader()
const loadedPlugins = ref<ConcretePluginDef[]>([])
const isLoading = ref(true)
const configs = ref<Record<string, ConcretePluginConfig>>({})

const drawerOpen = ref(true)

onMounted(async () => {
  await loader.loadPlugins()
  loadedPlugins.value = loader.getPlugins()

  const initConfigs: Record<string, ConcretePluginConfig> = {}
  for (const plugin of loadedPlugins.value) {
    const config: ConcretePluginConfig = { enabled: false }

    for (const [key, schema] of Object.entries(plugin.options)) {
      if (schema.default !== undefined) {
        config[key] = schema.default
      }
    }

    initConfigs[plugin.id] = config
  }

  configs.value = initConfigs
  isLoading.value = false
})

function test() {
  const active = resolveEnabledPlugins(loadedPlugins.value, configs.value)
  const sorted = sortPlugins(loadedPlugins.value)

  console.log(active, sorted)
}
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="options-drawer" type="checkbox" class="drawer-toggle" v-model="drawerOpen" />

    <div class="drawer-content flex flex-col p-4">page content here</div>

    <div class="drawer-side p-5">
      <div class="flex justify-end">
        <label for="options-drawer" class="btn btn-primary drawer-button lg:hidden">
          {{ drawerOpen ? 'Close' : 'Open' }} Menu
        </label>
      </div>

      <header class="py-4">
        <h1 class="text-2xl font-bold">Velour Configuration Options</h1>
      </header>

      <main class="">
        <div v-if="isLoading">Loading modules...</div>

        <template v-else>
          <PluginOptionsCard
            v-for="plugin in loadedPlugins"
            :key="plugin.id"
            :plugin="plugin"
            v-model="configs[plugin.id]!"
          />
        </template>
        <button class="btn" @click="test">YAYYYY</button>
      </main>
    </div>
  </div>
</template>
