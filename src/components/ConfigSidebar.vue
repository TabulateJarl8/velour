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
  if (window.confirm('This will reset all of the current configuration. Are you sure?')) {
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

    <div class="bg-base-100 border-base-300 flex h-full w-full flex-col border-r sm:w-lg">
      <!-- make the sticky header have a higher z index so that the content "scrolls" underneath it instead of on top of it -->
      <header
        class="border-base-300 bg-base-100 sticky top-0 z-10 flex items-center justify-between border-b p-6"
      >
        <div>
          <h1 class="text-primary text-2xl font-black">Velour Script Configuration</h1>
          <p class="mt-1 text-sm opacity-70">Browse and enable options and apps</p>
        </div>

        <div class="flex-none lg:hidden">
          <label for="config-drawer" aria-label="close sidebar" class="btn btn-square btn-ghost">
            <!-- TODO: is there a better icon than an X -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </label>
        </div>
      </header>

      <div class="flex-1 overflow-y-auto p-4 overflow-x-hidden">
        <!-- TODO: would this look better as a daisyui skeleton -->
        <div v-if="isLoading" class="flex h-48 flex-col items-center justify-center gap-4">
          <span class="loading loading-ring loading-lg text-primary"></span>
          <span class="text-base-content/70">Loading plugins...</span>
        </div>

        <div v-else>
          <div class="card bg-base-200 mb-6 shadow-sm">
            <div class="card-body">
              <h3 class="card-title text-sm font-bold opacity-70">Script Output Mode</h3>
              <div class="flex flex-col gap-2 mt-2">
                <label class="label cursor-pointer justify-start gap-4">
                  <input
                    type="radio"
                    class="radio radio-primary"
                    :checked="!quietMode"
                    @change="quietMode = false"
                  />
                  <span class="label-text font-medium">Verbose</span>
                </label>
                <label class="label cursor-pointer justify-start gap-4">
                  <input
                    type="radio"
                    class="radio radio-primary"
                    :checked="quietMode"
                    @change="quietMode = true"
                  />
                  <span class="label-text font-medium">Quiet</span>
                </label>
              </div>
            </div>
          </div>

          <!-- TODO: does this look good -->
          <div
            class="flex flex-1 flex-row justify-between gap-3 sticky -top-4 z-10 bg-base-100 -mx-4 p-4"
          >
            <label class="input input-bordered flex items-center gap-2">
              <svg
                class="h-[1em] opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
              <input v-model="query" type="text" class="grow" placeholder="Search options..." />
              <!-- TODO: do i want this -->
              <!-- <kbd class="kbd kbd-sm">Ctrl</kbd>
              <kbd class="kbd kbd-sm">K</kbd> -->
            </label>
            <button class="btn btn-soft btn-error" @click="clearOptions">Clear Options</button>
          </div>

          <div class="divider"></div>

          <div
            v-if="filteredSearchPlugins.length === 0"
            class="text-center py-10 opacity-50 break-all"
          >
            No options found matching "{{ query }}"
          </div>

          <div
            v-for="category in filteredSearchPlugins"
            :key="category.name"
            class="collapse collapse-arrow bg-base-200 mb-4"
          >
            <input type="checkbox" :checked="isSearching ? true : undefined" />
            <div class="collapse-title text-xl font-bold">
              {{ category.name }}
              <!-- TODO: can this be positioned better -->
              <span v-if="isSearching" class="badge badge-primary badge-sm ml-2">
                {{ category.pluginGroups.reduce((acc, group) => acc + group.plugins.length, 0) }}
                matches
              </span>
            </div>
            <div class="collapse-content bg-base-300">
              <div class="flex flex-col gap-2 pt-4">
                <template v-for="group in category.pluginGroups" :key="group.heading || 'default'">
                  <!-- TODO: can i style this text/border better -->
                  <h4
                    v-if="group.heading"
                    class="border-neutral-500 text-base-content/80 mb-1 mt-2 first:mt-0 border-b pb-2 text-lg font-bold"
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
