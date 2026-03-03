<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  highlightedScriptHtml: string
  validationErrors?: Record<string, string>
}>()

const hasValidationErrors = computed(() => {
  return props.validationErrors && Object.keys(props.validationErrors).length !== 0
})
</script>

<style scoped>
/* shiki highlighting needs style overrides to work on the daisyui code block */
:deep(.shiki) {
  background-color: transparent !important;
}

:deep(.shiki::before) {
  display: none !important;
}
</style>

<template>
  <main class="flex flex-1 flex-col p-6 lg:p-12">
    <div class="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base-content text-3xl font-extrabold">Generated Script</h2>
          <p class="text-base-content/70 mt-1">Copy or download your setup script below:</p>
        </div>
        <div
          :class="{ tooltip: hasValidationErrors }"
          data-tip="Fix any configuration errors to download script"
        >
          <button class="btn btn-primary" :disabled="hasValidationErrors">Download Script</button>
        </div>
      </div>

      <div
        class="mockup-code bg-neutral text-neutral-content max-h-[70vh] flex-1 flex flex-col shadow-xl"
      >
        <div class="overflow-y-auto flex-1 pb-4">
          <template v-if="validationErrors">
            <div
              v-for="(error, plugin) in validationErrors"
              :key="plugin"
              class="alert alert-error alert-soft mx-10 mb-3 mt-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span><strong>Configuration Error:</strong> {{ error }}</span>
            </div>

            <div class="px-6 pt-2 pb-4 select-none opacity-40 font-mono text-sm">
              # --- Script Preamble Ends Here (setup & utility functions) ---
            </div>

            <div v-html="highlightedScriptHtml" class="px-6 text-sm"></div>

            <div class="px-6 pt-4 pb-2 select-none opacity-40 font-mono text-sm">
              # --- Script Footer Begins Here (cleanup) ---
            </div>
          </template>
        </div>
      </div>
    </div>
  </main>
</template>
