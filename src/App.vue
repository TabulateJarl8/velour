<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { PluginLoader } from './core/loader'
import type { ConcretePluginConfig, ConcretePluginDef } from './core/types'
import PluginOptionsCard from './components/PluginOptionsCard.vue'
import { buildPluginScripts } from './core/scriptGenerator'

// import { createHighlighter, type Highlighter } from 'shiki'
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
// import { createOnigurumaEngine } from 'shiki/engine/oniguruma'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

const loader = new PluginLoader()
const loadedPlugins = ref<ConcretePluginDef[]>([])
const isLoading = ref(true)
const configs = ref<Record<string, ConcretePluginConfig>>({})
const quietMode = ref(false)

const highlightedScriptHtml = ref('')
let highlighter: HighlighterCore | null = null

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

const generatedScript = computed(() => {
  if (isLoading.value) {
    return '# Loading plugins...'
  }
  return buildPluginScripts(loadedPlugins.value, configs.value, quietMode.value)
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

<style scoped>
/* hiki highlighting needs style overrides to work on the daisyui code block */
:deep(.shiki) {
  background-color: transparent !important;
}

:deep(.shiki::before) {
  display: none !important;
}
</style>

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
      <!-- TODO: copy button -->
      <main class="flex flex-1 flex-col overflow-y-auto p-6 lg:p-12">
        <div class="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base-content text-3xl font-extrabold">Generated Script</h2>
              <p class="text-base-content/70 mt-1">Copy or download your setup script below:</p>
            </div>
          </div>

          <div
            class="mockup-code bg-neutral text-neutral-content h-0 min-h-125 flex-1 overflow-y-auto shadow-xl"
          >
            <div v-html="highlightedScriptHtml" class="px-6 text-sm"></div>
          </div>
        </div>
      </main>
    </div>

    <!-- sidebar content -->
    <div class="drawer-side h-full shadow-xl">
      <!-- from daisyui: click outside of drawer content to close it on smaller screens where it doesn't fill the full viewport width -->
      <label for="config-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

      <div class="bg-base-100 border-base-300 flex min-h-full w-full flex-col border-r sm:w-lg">
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

        <div class="flex-1 overflow-y-auto p-4">
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

            <div class="divider"></div>

            <PluginOptionsCard
              v-for="plugin in loadedPlugins"
              :key="plugin.id"
              :plugin="plugin"
              v-model="configs[plugin.id]!"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
