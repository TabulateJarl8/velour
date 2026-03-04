<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  highlightedScriptHtml: string
  validationErrors?: Record<string, string>
  isLoading: boolean
  showCopySuccess: boolean
}>()

const emit = defineEmits<{
  download: []
  copyPermalink: []
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
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-base-content text-3xl font-extrabold">Generated Script:</h2>
        </div>
        <div class="flex flex-col sm:flex-row gap-5">
          <button
            class="btn btn-soft w-full sm:w-56"
            :class="showCopySuccess ? 'btn-success' : 'btn-info'"
            @click="emit('copyPermalink')"
            :disabled="isLoading"
          >
            <!-- show check mark if copy success, else show link -->
            <svg
              v-if="showCopySuccess"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="size-5"
            >
              <path
                fill-rule="evenodd"
                d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
                clip-rule="evenodd"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="size-5"
            >
              <path
                d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z"
              />
              <path
                d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z"
              />
            </svg>

            {{ showCopySuccess ? 'Copied!' : 'Copy Script Permalink' }}
          </button>

          <div
            :class="{ tooltip: hasValidationErrors }"
            data-tip="Fix any configuration errors to download script"
          >
            <button
              class="btn btn-primary w-full sm:w-auto"
              :disabled="hasValidationErrors || isLoading"
              @click="emit('download')"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                class="size-5"
              >
                <path
                  d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z"
                />
                <path
                  d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"
                />
              </svg>
              Download Script
            </button>
          </div>
        </div>
      </div>

      <div
        class="mockup-code bg-neutral text-neutral-content max-h-[70vh] flex-1 flex flex-col shadow-xl"
      >
        <div class="overflow-y-auto flex-1 pb-4">
          <div v-if="hasValidationErrors" class="sticky left-0">
            <div
              v-for="(error, plugin) in validationErrors"
              :key="plugin"
              class="alert alert-error alert-soft mx-3 sm:mx-10 mb-3 mt-2 shadow-lg"
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
          </div>

          <div class="px-6 pt-2 pb-4 select-none opacity-40 font-mono text-sm text-nowrap">
            # --- Script Preamble Ends Here (setup & utility functions) ---
          </div>

          <div v-html="highlightedScriptHtml" class="px-6 text-sm"></div>

          <div class="px-6 pt-4 pb-2 select-none opacity-40 font-mono text-sm text-nowrap">
            # --- Script Footer Begins Here (cleanup) ---
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
