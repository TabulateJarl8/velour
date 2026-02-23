<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { PluginLoader } from './core/loader'
import {
  Categories,
  CategoryHeadingsData,
  type Category,
  type CategoryHeadings,
  type ConcretePluginConfig,
  type ConcretePluginDef,
} from './core/types'
import { buildPluginScripts } from './core/scriptGenerator'

import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import ScriptPreview from './components/ScriptPreview.vue'
import ConfigSidebar from './components/ConfigSidebar.vue'

const loader = new PluginLoader()
const loadedPlugins = ref<ConcretePluginDef[]>([])
const isLoading = ref(true)
const pluginConfigs = ref<Record<string, ConcretePluginConfig>>({})
const quietMode = ref(false)

const highlightedScriptHtml = ref('')
let highlighter: HighlighterCore | null = null

export interface PluginGroup {
  heading: CategoryHeadings[keyof CategoryHeadings] | null
  plugins: ConcretePluginDef[]
}

export interface CategoryGroup {
  name: Category
  pluginGroups: PluginGroup[]
}

onMounted(async () => {
  highlighter = await createHighlighterCore({
    themes: [import('@shikijs/themes/catppuccin-mocha')],
    langs: [import('@shikijs/langs/bash')],
    // TODO: is JS regex engine always better than wasm one for the web?
    // https://shiki.style/guide/best-performance#javascript-engine-and-pre-compiled-languages
    // engine: createOnigurumaEngine(import('shiki/wasm')),
    engine: createJavaScriptRegexEngine(),
  })

  await loader.loadPlugins()
  loadedPlugins.value = loader.getPlugins()

  const initConfigs: Record<string, ConcretePluginConfig> = {}
  for (const plugin of loadedPlugins.value) {
    initConfigs[plugin.id] = PluginLoader.initializePluginConfig(plugin)
  }

  pluginConfigs.value = initConfigs
  isLoading.value = false
})

const generatedScript = computed(() => {
  if (isLoading.value) {
    return '# Loading plugins...'
  }
  return buildPluginScripts(loadedPlugins.value, pluginConfigs.value, quietMode.value)
})

const categorizedPlugins = computed<CategoryGroup[]>(() => {
  // map each category to a list of associated plugins/headings
  return Object.values(Categories).map((category) => {
    const hasHeadings = category in CategoryHeadingsData
    const pluginGroups = []

    if (hasHeadings) {
      // if current category has headings, iterate over each one and add list of
      // plugins under that heading
      for (const heading of CategoryHeadingsData[category as keyof typeof CategoryHeadingsData]) {
        const plugins = loadedPlugins.value.filter(
          (p) => p.category === category && p.heading === heading,
        )
        if (plugins.length > 0) pluginGroups.push({ heading, plugins })
      }
    } else {
      // no headings; add all plugins from the category
      const plugins = loadedPlugins.value.filter((p) => p.category === category)
      if (plugins.length > 0) pluginGroups.push({ heading: null, plugins })
    }

    return {
      name: category,
      pluginGroups,
    }
  })
})

watch(
  generatedScript,
  (script) => {
    if (highlighter) {
      highlightedScriptHtml.value = highlighter.codeToHtml(script, {
        lang: 'bash',
        theme: 'catppuccin-mocha',
      })
    } else {
      // fallback if highlighter isnt initialized for some reason
      highlightedScriptHtml.value = `<pre><code>${script}</code></pre>`
    }
  },
  { immediate: true },
)
</script>

<template>
  <!-- mostly stolen from https://daisyui.com/components/drawer/?lang=en#navbar-menu-for-desktop--sidebar-drawer-for-mobile -->
  <div class="drawer lg:drawer-open h-dvh">
    <input id="config-drawer" type="checkbox" class="drawer-toggle" />

    <!-- sidebar should take up the full screen height -->
    <div class="drawer-content bg-base-200 flex flex-col">
      <div class="navbar bg-base-100 w-full shadow-sm">
        <div class="flex-none lg:hidden">
          <label for="config-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <!-- TODO: should i pull in an icon library or stick with the daisyui embedded svg -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-6 w-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div class="mx-2 flex-1 px-2 text-xl font-bold">Velour</div>
      </div>

      <!-- page content: show script -->
      <!-- TODO: download button -->
      <ScriptPreview :highlighted-script-html="highlightedScriptHtml" />
    </div>

    <ConfigSidebar
      :is-loading="isLoading"
      :categorized-plugins="categorizedPlugins"
      v-model:quiet-mode="quietMode"
      v-model:plugin-configs="pluginConfigs"
    />
  </div>
</template>
