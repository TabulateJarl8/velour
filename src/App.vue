<script setup lang="ts">
import { useShiki } from './composables/useShiki'

import ScriptPreview from './components/ScriptPreview.vue'
import ConfigSidebar from './components/ConfigSidebar.vue'
import { usePlugins } from './composables/usePlugins'

import { version } from '../package.json'
import ProjectDescription from './components/ProjectDescription.vue'
import { ref } from 'vue'
import { logger } from './core/logger'

const {
  isLoading,
  pluginConfigs,
  quietMode,
  categorizedPlugins,
  generatedScript,
  validationErrors,
  downloadScript,
  generatePermalink,
  importScript,
} = usePlugins()

const { highlightedScriptHtml } = useShiki(generatedScript)

const showCopySuccess = ref(false)

// copy permalink to clipboard
const copyPermalink = async () => {
  try {
    const url = await generatePermalink()
    await navigator.clipboard.writeText(url)

    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 3000)
  } catch (e) {
    logger.error('Could not copy permalink: ', e)
  }
}

// https://stackoverflow.com/a/71849133/11591238
const aboutModal = ref<InstanceType<typeof ProjectDescription> | null>(null)
const openAboutModal = () => {
  aboutModal.value?.showModal()
}
</script>

<template>
  <!-- mostly stolen from https://daisyui.com/components/drawer/?lang=en#navbar-menu-for-desktop--sidebar-drawer-for-mobile -->
  <div class="drawer lg:drawer-open h-dvh overflow-hidden bg-base-100 text-base-content">
    <input id="config-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col h-full">
      <!-- navbar starts here -->
      <div class="navbar bg-base-100/70 border-b border-base-300/50 w-full shadow-sm">
        <div class="flex-none lg:hidden">
          <label for="config-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <i-heroicons-bars-3-solid class="inline-block h-6 w-6 stroke-current" />
          </label>
        </div>
        <div
          class="mx-2 flex-1 px-2 flex flex-col items-start sm:flex-row sm:items-center gap-1 sm:gap-3"
        >
          <div class="text-xl font-extrabold tracking-tight">Velour</div>
          <div class="badge badge-primary badge-sm badge-soft font-mono shrink-0 text-nowrap">
            v{{ version }}
          </div>
        </div>

        <div class="gap-2 mr-2">
          <button class="btn btn-ghost btn-sm" @click="openAboutModal">About</button>
          <a
            href="https://github.com/TabulateJarl8/velour"
            target="_blank"
            class="btn btn-square btn-ghost"
          >
            <i-simple-icons-github class="size-5 fill-current" />
          </a>
        </div>
      </div>

      <ScriptPreview
        :highlighted-script-html="highlightedScriptHtml"
        :validation-errors="validationErrors"
        :is-loading="isLoading"
        :show-copy-success="showCopySuccess"
        @download="downloadScript"
        @copy-permalink="copyPermalink"
        @import-script="importScript"
      />

      <ProjectDescription ref="aboutModal" />
    </div>

    <ConfigSidebar
      :is-loading="isLoading"
      :categorized-plugins="categorizedPlugins"
      v-model:quiet-mode="quietMode"
      v-model:plugin-configs="pluginConfigs"
    />
  </div>
</template>
