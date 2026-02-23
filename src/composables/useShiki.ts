import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'

import { onMounted, ref, watch, type Ref } from 'vue'

/**
 * Composable for highlighting a bash script with shiki
 *
 * @param bashScript The bash script to highlight
 * @returns HTML formatted with syntax highlighting
 */
export function useShiki(bashScript: Ref<string>) {
  let highlighter: HighlighterCore | null = null
  const highlightedScriptHtml = ref('')

  const highlight = () => {
    if (highlighter) {
      highlightedScriptHtml.value = highlighter.codeToHtml(bashScript.value, {
        lang: 'bash',
        theme: 'catppuccin-mocha',
      })
    } else {
      // fallback if highlighter isnt initialized for some reason
      highlightedScriptHtml.value = `<pre><code>${bashScript.value}</code></pre>`
    }
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
  })

  watch(
    bashScript,
    () => {
      highlight()
    },
    { immediate: true },
  )

  return { highlightedScriptHtml }
}
