<script lang="ts" setup>
defineProps<{ highlightedScriptHtml: string }>()
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
  <main class="flex flex-1 flex-col shrink-0 p-6 lg:p-12">
    <div class="mx-auto flex h-full w-full max-w-6xl flex-col gap-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base-content text-3xl font-extrabold">Generated Script</h2>
          <p class="text-base-content/70 mt-1">Copy or download your setup script below:</p>
        </div>
      </div>

      <div
        class="mockup-code bg-neutral text-neutral-content shrink-0 max-h-[70vh] flex-1 flex flex-col shadow-xl"
      >
        <div class="overflow-y-auto flex-1 pb-4">
          <div class="px-6 pt-2 pb-4 select-none opacity-40 font-mono text-sm">
            # --- Script Preamble Ends Here (setup & utility functions) ---
          </div>

          <div v-html="highlightedScriptHtml" class="px-6 text-sm"></div>

          <div class="px-6 pt-4 pb-2 select-none opacity-40 font-mono text-sm">
            # --- Script Footer Begins Here (cleanup) ---
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
