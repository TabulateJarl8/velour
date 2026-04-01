import { beforeEach, it, describe, vi, expect } from 'vitest'
import { defineComponent, ref } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { useShiki } from '../useShiki'
import { createHighlighterCore, type HighlighterCore } from 'shiki/core'

vi.mock('shiki/core', () => ({
  createHighlighterCore: vi.fn(),
}))

vi.mock('shiki/engine/javascript', () => ({
  createJavaScriptRegexEngine: vi.fn(),
}))

const MockComponent = defineComponent({
  props: ['code'],
  setup(props) {
    const script = ref(props.code)
    const { highlightedScriptHtml } = useShiki(script)
    return { highlightedScriptHtml, script }
  },
  template: '<div>{{ highlightedScriptHtml }}</div>',
})

describe('useShiki', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('provides a fallback if highlighter not loaded', async () => {
    // do NOT even ask me im so confused how any of this functions
    // https://test-utils.vuejs.org/guide/advanced/async-suspense.html#Resolving-Other-Asynchronous-Behavior
    let resolveHighlighter!: (value: HighlighterCore) => void

    // we need mockReturnValue rather than mockResolvedValue because
    // resolvedValue awaits the promise which i think would take us out of the
    // loading state
    vi.mocked(createHighlighterCore).mockReturnValueOnce(
      new Promise((r) => {
        resolveHighlighter = r
      }),
    )

    // test fallback when loading highlighter
    const wrapper = mount(MockComponent, { props: { code: 'echo test' } })
    expect(wrapper.vm.highlightedScriptHtml).toBe('<pre class="shiki"><code>echo test</code></pre>')

    resolveHighlighter({ codeToHtml: vi.fn() } as unknown as HighlighterCore)
    await flushPromises()
  })

  it('highlights code', async () => {
    const mockCodeToHtml = vi.fn().mockReturnValue('<span class="highlighted">echo test</span>')
    vi.mocked(createHighlighterCore).mockResolvedValueOnce({
      codeToHtml: mockCodeToHtml,
    } as unknown as HighlighterCore)

    const wrapper = mount(MockComponent, { props: { code: 'echo test' } })
    // resolve loading state
    await flushPromises()

    expect(mockCodeToHtml).toHaveBeenCalledWith('echo test', {
      lang: 'bash',
      theme: 'catppuccin-mocha',
    })
    expect(wrapper.vm.highlightedScriptHtml).toBe('<span class="highlighted">echo test</span>')
  })

  it('is reactive', async () => {
    const mockCodeToHtml = vi
      .fn()
      .mockImplementation((code) => `<span class="highlighted">${code}</span>`)
    vi.mocked(createHighlighterCore).mockResolvedValueOnce({
      codeToHtml: mockCodeToHtml,
    } as unknown as HighlighterCore)

    const wrapper = mount(MockComponent, { props: { code: 'echo test' } })
    // resolve loading state
    await flushPromises()

    expect(wrapper.vm.highlightedScriptHtml).toBe('<span class="highlighted">echo test</span>')

    wrapper.vm.script = '# now its a comment'
    await flushPromises() // react

    expect(wrapper.vm.highlightedScriptHtml).toBe(
      '<span class="highlighted"># now its a comment</span>',
    )
  })
})
