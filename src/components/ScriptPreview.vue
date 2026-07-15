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
  @apply bg-base-300 border border-base-300/50 shadow-2xl text-slate-300;
  @apply rounded-2xl relative flex-1 flex flex-col overflow-hidden max-h-[70vh] min-h-0;
}

.mockup-title-bar {
  @apply relative py-3 flex items-center justify-center shrink-0;
  @apply text-xs font-mono text-slate-500 font-medium tracking-wide;
  @apply bg-base-200 border-b border-white/5;
}

.mockup-title-bar::before {
  @apply absolute top-1/2 -translate-y-1/2 left-4 h-3 w-3 rounded-full;

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
      <div class="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div class="flex-1">
          <h2 class="text-base-content text-2xl font-bold tracking-tight">Your Setup Script</h2>
          <p class="text-sm text-base-content/60 mt-1">
            Review the generated code below before downloading or sharing:
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 shrink-0">
          <button
            class="btn w-full sm:w-56 shrink-0"
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
            class="shrink-0 w-full sm:w-auto"
            :class="{ 'tooltip tooltip-top': hasValidationErrors }"
            :data-tip="hasValidationErrors ? 'Fix configuration errors to download script' : null"
          >
            <button
              class="btn btn-primary w-full sm:w-auto shrink-0 text-nowrap"
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

        <div class="overflow-auto flex-1 w-full">
          <div
            v-if="hasValidationErrors"
            class="sticky top-0 left-0 z-10 w-full px-6 pt-4 pb-2 pointer-events-none"
          >
            <div
              v-for="(error, plugin) in validationErrors"
              :key="plugin"
              class="alert alert-error alert-soft mx-1 py-3 mb-2 backdrop-blur-lg pointer-events-auto shadow-lg"
            >
              <i-heroicons-x-circle class="h-5 w-5 shrink-0 stroke-current" />
              <span><span class="font-bold">Configuration Error:</span> {{ error }}</span>
            </div>
          </div>

          <div class="min-w-max px-6 pt-4 pb-6 pointer-events-auto font-mono">
            <div class="pb-3 select-none text-slate-500/70 text-xs italic text-nowrap">
              # --- Script Preamble Ends Here (setup & utility functions) ---
            </div>

            <div v-html="highlightedScriptHtml"></div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
