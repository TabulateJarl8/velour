<script setup lang="ts">
import { useShiki } from './composables/useShiki'

import ScriptPreview from './components/ScriptPreview.vue'
import ConfigSidebar from './components/ConfigSidebar.vue'
import { usePlugins } from './composables/usePlugins'

const { isLoading, pluginConfigs, quietMode, categorizedPlugins, generatedScript } = usePlugins()
const { highlightedScriptHtml } = useShiki(generatedScript)
</script>

<template>
  <!-- mostly stolen from https://daisyui.com/components/drawer/?lang=en#navbar-menu-for-desktop--sidebar-drawer-for-mobile -->
  <div class="drawer lg:drawer-open h-dvh overflow-hidden">
    <input id="config-drawer" type="checkbox" class="drawer-toggle" />

    <!-- sidebar should take up the full screen height -->
    <div class="drawer-content bg-base-200 flex flex-col h-full">
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
