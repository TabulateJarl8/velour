<script lang="ts" setup>
import type { CategoryGroup } from '@/composables/usePlugins'
import PluginOptionsCard from './PluginOptionsCard.vue'
import type { ConcretePluginConfig } from '@/core/types'
import { computed, ref } from 'vue'
import { PluginLoader } from '@/core/loader'

const props = defineProps<{ isLoading: boolean; categorizedPlugins: CategoryGroup[] }>()

const quietMode = defineModel<boolean>('quietMode', { required: true })
const pluginConfigs = defineModel<Record<string, ConcretePluginConfig>>('pluginConfigs', {
  required: true,
})

const query = ref('')

// filter the plugins for the search query
const filteredSearchPlugins = computed(() => {
  const normalizedQuery = query.value.toLowerCase().trim()
  if (!normalizedQuery) return props.categorizedPlugins

  return (
    props.categorizedPlugins
      .map((category) => {
        // for each category, filter to only the groups with plugins matching the query
        const filtered = category.pluginGroups
          .map((group) => ({
            ...group,
            plugins: group.plugins.filter(
              (plugin) =>
                plugin.name.toLowerCase().includes(normalizedQuery) ||
                plugin.description.toLowerCase().includes(normalizedQuery),
            ),
          }))
          .filter((group) => group.plugins.length > 0)

        /// return the category with the filtered plugins
        return { ...category, pluginGroups: filtered }
      })
      // filter to only categories with matching plugins
      .filter((category) => category.pluginGroups.length > 0)
  )
})

const isSearching = computed(() => query.value.trim().length > 0)

const clearOptions = () => {
  if (
    window.confirm('This will reset all of the current configuration to its default. Are you sure?')
  ) {
    query.value = ''
    quietMode.value = false
    for (const cat of props.categorizedPlugins)
      for (const group of cat.pluginGroups)
        for (const plugin of group.plugins)
          if (pluginConfigs.value[plugin.id])
            pluginConfigs.value[plugin.id] = PluginLoader.initializePluginConfig(plugin)
  }
}
</script>

<template>
  <!-- sidebar content -->
  <div class="drawer-side h-full shadow-xl">
    <!-- from daisyui: click outside of drawer content to close it on smaller screens where it doesn't fill the full viewport width -->
    <label for="config-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

    <div class="bg-base-200 border-base-300 flex h-full w-full flex-col border-r sm:w-md">
      <!-- make the sticky header have a higher z index so that the content "scrolls" underneath it instead of on top of it -->
      <header
        class="border-base-300 bg-base-200/80 sticky top-0 z-10 flex flex-col gap-4 border-b p-6"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex flex-1 items-center justify-between">
            <div>
              <h1 class="text-xl font-bold tracking-tight">Script Configuration</h1>
              <p class="text-base-content/60 mt-0.5 text-xs">Browse and enable options and apps</p>
            </div>

            <button
              class="btn btn-sm btn-outline btn-error hidden opacity-70 hover:opacity-100 lg:inline-flex"
              @click="clearOptions"
              title="Reset all script configuration to defaults"
            >
              Reset All
            </button>
          </div>

          <div class="flex-none lg:hidden">
            <label
              for="config-drawer"
              aria-label="close sidebar"
              class="btn btn-sm btn-square btn-ghost"
            >
              <i-heroicons-x-mark class="size-4 [&>path]:stroke-3" />
            </label>
          </div>
        </div>

        <div class="flex gap-2">
          <label class="input input-bordered flex-1">
            <i-heroicons-magnifying-glass-20-solid class="h-4 w-4 opacity-50" />
            <input v-model="query" type="text" class="grow" placeholder="Search options..." />
          </label>

          <button
            class="btn btn-sm btn-outline btn-error h-full opacity-70 hover:opacity-100 lg:hidden"
            @click="clearOptions"
            title="Reset all script configuration to defaults"
          >
            Reset All
          </button>
        </div>
      </header>

      <div class="flex-1 overflow-x-hidden overflow-y-auto p-4">
        <div v-if="isLoading" class="flex h-48 flex-col items-center justify-center gap-4">
          <span class="loading loading-ring loading-lg text-primary"></span>
          <span class="text-base-content/70">Loading plugins...</span>
        </div>

        <div v-else>
          <div
            class="border-base-300 bg-base-200 hover:border-primary/40 has-focus-visible:ring-primary/70 collapse mb-6 border outline-none has-focus-visible:ring-2"
          >
            <input type="checkbox" v-model="quietMode" />

            <div class="collapse-title flex items-start gap-4 p-4">
              <input
                type="checkbox"
                :checked="quietMode"
                class="checkbox checkbox-sm checkbox-primary pointer-events-none mt-0.75"
                tabindex="-1"
              />
              <div>
                <h3
                  class="text-sm leading-tight font-semibold"
                  :class="{ 'text-primary': quietMode }"
                >
                  Quiet Mode
                </h3>
                <p class="text-base-content/60 mt-1 text-xs leading-relaxed">
                  Suppress the script output while it is running
                </p>
              </div>
            </div>
          </div>

          <div
            v-if="filteredSearchPlugins.length === 0"
            class="text-base-content/50 py-10 text-center text-sm break-all"
          >
            No options found matching "<span class="text-base-content">{{ query }}</span
            >"
          </div>

          <div
            v-for="category in filteredSearchPlugins"
            :key="category.name"
            class="collapse-arrow bg-base-100 border-base-300 collapse mb-4 border shadow-sm"
          >
            <input type="checkbox" :checked="isSearching ? true : undefined" />
            <div class="collapse-title flex items-center text-base font-bold">
              {{ category.name }}
              <span v-if="isSearching" class="badge badge-primary badge-soft badge-sm ml-auto">
                {{ category.pluginGroups.reduce((acc, group) => acc + group.plugins.length, 0) }}
                matches
              </span>
            </div>
            <div class="collapse-content bg-base-100/50">
              <div class="flex flex-col gap-3">
                <template v-for="group in category.pluginGroups" :key="group.heading || 'default'">
                  <h4
                    v-if="group.heading"
                    class="border-base-200 text-primary/80 mt-4 border-b pb-2 text-xs font-bold tracking-wider uppercase first:mt-0"
                  >
                    {{ group.heading }}
                  </h4>

                  <PluginOptionsCard
                    v-for="plugin in group.plugins"
                    :key="plugin.id"
                    :plugin="plugin"
                    v-model="pluginConfigs[plugin.id]!"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
