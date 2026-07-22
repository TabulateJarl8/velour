<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core'
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
  importScript: [file: File]
}>()

const hasValidationErrors = computed(() => {
  return props.validationErrors && Object.keys(props.validationErrors).length !== 0
})

const { open: handleFileUpload, onChange: onFileDialog } = useFileDialog({
  accept: '.sh,.bash',
  multiple: false,
})

onFileDialog((files) => {
  if (files && files.length > 0) {
    const confirmed = window.confirm(
      'Importing a script will overwrite all of your current config. Are you sure?',
    )

    if (confirmed) {
      emit('importScript', files[0])
    }
  }
})
</script>

<style scoped>
@reference "../assets/main.css";

/* shiki highlighting needs style overrides to work on the daisyui code block */
:deep(.shiki) {
  background-color: transparent !important;
}

:deep(.shiki::before) {
  display: none !important;
}

:deep(.shiki code) {
  font-size: 0.85rem;
  line-height: 1.6;
}

.mockup-code-custom {
  @apply bg-base-300 border-base-300/50 border text-slate-300 shadow-2xl;
  @apply relative flex max-h-[70vh] min-h-0 flex-1 flex-col overflow-hidden rounded-2xl;
}

.mockup-title-bar {
  @apply relative flex shrink-0 items-center justify-center py-3;
  @apply font-mono text-xs font-medium tracking-wide text-slate-500;
  @apply bg-base-200 border-b border-white/5;
}

.mockup-title-bar::before {
  @apply absolute top-1/2 left-4 h-3 w-3 -translate-y-1/2 rounded-full;

  content: '';
  background-color: theme('colors.error');
  box-shadow:
    1.4rem 0 0 theme('colors.warning'),
    2.8rem 0 0 theme('colors.success');
}
</style>

<template>
  <main class="flex flex-1 flex-col p-4 sm:p-8 lg:p-12">
    <div class="mx-auto flex h-full w-full max-w-5xl flex-col gap-6">
      <div class="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
        <div class="flex-1">
          <h2 class="text-base-content text-2xl font-bold tracking-tight">Your Setup Script</h2>
          <p class="text-base-content/60 mt-1 text-sm">
            Review the generated code below before downloading or sharing:
          </p>
        </div>

        <div class="flex w-full flex-wrap justify-end gap-3 xl:w-auto">
          <div class="tooltip grow xl:grow-0" data-tip="Import Configuration From Script">
            <button
              class="btn btn-outline btn-secondary w-full shrink-0 text-nowrap"
              :disabled="isLoading"
              @click="handleFileUpload()"
            >
              <i-heroicons-arrow-up-tray-20-solid class="size-4 shrink-0" />
              <span class="xl:hidden">Import Script</span>
            </button>
          </div>

          <button
            class="btn shrink-0 grow xl:w-56 xl:grow-0"
            :class="showCopySuccess ? 'btn-success' : 'btn-soft border-info btn-info'"
            @click="emit('copyPermalink')"
            :disabled="isLoading"
          >
            <!-- show check mark if copy success, else show link -->
            <i-heroicons-check-20-solid v-if="showCopySuccess" class="size-4 shrink-0" />
            <i-heroicons-link-20-solid v-else class="size-4 shrink-0" />
            <span class="text-nowrap">{{
              showCopySuccess ? 'Copied!' : 'Copy Script Permalink'
            }}</span>
          </button>

          <div
            class="grow xl:grow-0"
            :class="{ 'tooltip tooltip-top': hasValidationErrors }"
            :data-tip="hasValidationErrors ? 'Fix configuration errors to download script' : null"
          >
            <button
              class="btn btn-primary w-full shrink-0 text-nowrap"
              :disabled="hasValidationErrors || isLoading"
              @click="emit('download')"
            >
              <i-heroicons-arrow-down-tray-20-solid class="size-4 shrink-0" />
              Download Script
            </button>
          </div>
        </div>
      </div>

      <div class="mockup-code-custom">
        <div class="mockup-title-bar">velour_fedora_setup.sh</div>

        <div class="w-full flex-1 overflow-auto">
          <div
            v-if="hasValidationErrors"
            class="pointer-events-none sticky top-0 left-0 z-10 w-full px-6 pt-4 pb-2"
          >
            <div
              v-for="(error, plugin) in validationErrors"
              :key="plugin"
              class="alert alert-error alert-soft pointer-events-auto mx-1 mb-2 py-3 shadow-lg backdrop-blur-lg"
            >
              <i-heroicons-x-circle class="h-5 w-5 shrink-0 stroke-current" />
              <span><span class="font-bold">Configuration Error:</span> {{ error }}</span>
            </div>
          </div>

          <div class="pointer-events-auto min-w-max px-6 pt-4 pb-6 font-mono">
            <div class="pb-3 text-xs text-nowrap text-slate-500/70 italic select-none">
              # --- Script Preamble Ends Here (setup & utility functions) ---
            </div>

            <div v-html="highlightedScriptHtml"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
