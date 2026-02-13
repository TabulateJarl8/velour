<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { PluginLoader } from './core/loader'
import type { GenericPlugin } from './core/types'

const loader = new PluginLoader()
const loadedPlugins = ref<GenericPlugin[]>([])
const isLoading = ref(true)

onMounted(async () => {
  await loader.loadPlugins()
  loadedPlugins.value = loader.getPlugins()
  isLoading.value = false
})
</script>

<template>
  <header></header>

  <main>
    <div v-if="isLoading">Loading modules...</div>

    <ul v-else>
      <li v-for="plugin in loadedPlugins" :key="plugin.id">
        <strong>{{ plugin.name }}</strong> (ID: {{ plugin.id }})
        <p>{{ Object.keys(plugin.options).length }} features available.</p>
      </li>
    </ul>
  </main>
</template>
