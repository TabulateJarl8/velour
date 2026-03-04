<script setup lang="ts">
import { useShiki } from './composables/useShiki'

import ScriptPreview from './components/ScriptPreview.vue'
import ConfigSidebar from './components/ConfigSidebar.vue'
import { usePlugins } from './composables/usePlugins'

import { version } from '../package.json'
import ProjectDescription from './components/ProjectDescription.vue'
import { ref } from 'vue'

const {
  isLoading,
  pluginConfigs,
  quietMode,
  categorizedPlugins,
  generatedScript,
  validationErrors,
  downloadScript,
} = usePlugins()
const { highlightedScriptHtml } = useShiki(generatedScript)

// https://stackoverflow.com/a/71849133/11591238
const aboutModal = ref<InstanceType<typeof ProjectDescription> | null>(null)
const openAboutModal = () => {
  aboutModal.value?.showModal()
}
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
        <div class="mx-2 flex-1 px-2 flex flex-col justify-center">
          <div class="text-xl font-bold leading-tight">Velour</div>
          <div class="text-[10px] sm:text-xs tracking-wider opacity-60 leading-tight">
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
            <!-- from simpleicons -->
            <svg
              width="24"
              height="24"
              class="fill-white"
              role="img"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
              />
            </svg>
          </a>
        </div>
      </div>

      <!-- page content: show script -->
      <ScriptPreview
        :highlighted-script-html="highlightedScriptHtml"
        :validation-errors="validationErrors"
        @download="downloadScript"
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
