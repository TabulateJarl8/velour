import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ScriptPreview from '@/components/ScriptPreview.vue'

const { mockOpen, mockOnChange } = vi.hoisted(() => ({
  mockOpen: vi.fn(),
  mockOnChange: vi.fn(),
}))

vi.mock('@vueuse/core', async (importOriginal) => {
  const vueuse = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...vueuse,
    useFileDialog: () => ({
      open: mockOpen,
      onChange: mockOnChange,
    }),
  }
})

describe('ScriptPreview', () => {
  const defaultProps = {
    highlightedScriptHtml: '<span class="MOCK">mOCk</span>',
    isLoading: false,
    showCopySuccess: false,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders script html', () => {
    const wrapper = mount(ScriptPreview, { props: defaultProps })
    expect(wrapper.html()).toContain(defaultProps.highlightedScriptHtml)
  })

  describe('copy button', () => {
    it('emits copyPermalink', async () => {
      const wrapper = mount(ScriptPreview, { props: defaultProps })

      const copyButton = wrapper.findAll('button').find((b) => b.text().includes('Permalink'))
      expect(copyButton!.classes()).toContain('btn-info')

      await copyButton?.trigger('click')

      expect(wrapper.emitted('copyPermalink')).toBeTruthy()
    })

    it('shows copy success text when showCopySuccess is true', () => {
      const wrapper = mount(ScriptPreview, {
        props: { ...defaultProps, showCopySuccess: true },
      })

      const copyButton = wrapper.findAll('button').find((b) => b.text().includes('Copied!'))
      expect(copyButton!.classes()).toContain('btn-success')
    })
  })

  describe('download button', () => {
    it('emits download', async () => {
      const wrapper = mount(ScriptPreview, { props: defaultProps })

      const downloadButton = wrapper.findAll('button').find((b) => b.text().includes('Download'))
      await downloadButton!.trigger('click')

      expect(wrapper.emitted('download')).toBeTruthy()
    })

    it('disables the download button when loading', () => {
      const wrapper = mount(ScriptPreview, {
        props: { ...defaultProps, isLoading: true },
      })

      const downloadButton = wrapper.findAll('button').find((b) => b.text().includes('Download'))
      expect(downloadButton!.attributes()).toHaveProperty('disabled')
    })
  })

  describe('import button', () => {
    it('opens file picker when import script clicked', async () => {
      const wrapper = mount(ScriptPreview, { props: defaultProps })

      const importButton = wrapper.findAll('button').find((b) => b.text().includes('Import Script'))
      await importButton!.trigger('click')

      expect(mockOpen).toHaveBeenCalledOnce()
    })

    it('emits importScript with file', () => {
      const wrapper = mount(ScriptPreview, { props: defaultProps })

      const callback = mockOnChange.mock.calls[0][0]
      const file = new File(['echo mock'], 'fun.sh')

      callback([file])

      expect(window.confirm).toHaveBeenCalledWith(
        'Importing a script will overwrite all of your current config. Are you sure?',
      )
      expect(wrapper.emitted('importScript')).toBeTruthy()
      expect(wrapper.emitted('importScript')?.[0]).toEqual([file])
    })

    it('doesnt emit importScript if confirm is cancelled', () => {
      vi.spyOn(window, 'confirm').mockImplementation(() => false)

      const wrapper = mount(ScriptPreview, { props: defaultProps })
      const callback = mockOnChange.mock.calls[0][0]

      callback([new File([''], 'cool.sh')])

      expect(window.confirm).toHaveBeenCalled()
      expect(wrapper.emitted('importScript')).toBeUndefined()
    })

    it('does nothing when no files are given', () => {
      const wrapper = mount(ScriptPreview, { props: defaultProps })
      const callback = mockOnChange.mock.calls[0][0]

      callback([])
      callback(null)

      expect(window.confirm).not.toHaveBeenCalled()
      expect(wrapper.emitted('importScript')).toBeUndefined()
    })
  })

  describe('validation errors', () => {
    it('has no error content when no errors are present', () => {
      const wrapper = mount(ScriptPreview, {
        props: { ...defaultProps, validationErrors: {} },
      })

      expect(wrapper.find('.alert-error').exists()).toBe(false)

      const downloadButton = wrapper.findAll('button').find((b) => b.text().includes('Download'))
      expect(downloadButton!.attributes()).not.toHaveProperty('disabled')
    })

    it('shows errors and disables download button properly', () => {
      const wrapper = mount(ScriptPreview, {
        props: {
          ...defaultProps,
          validationErrors: {
            one: 'evil error',
            two: 'bad error',
          },
        },
      })

      const errors = wrapper.findAll('.alert-error')
      expect(errors).toHaveLength(2)
      expect(errors[0].text()).toContain('Configuration Error: evil error')
      expect(errors[1].text()).toContain('Configuration Error: bad error')

      const downloadButton = wrapper.findAll('button').find((b) => b.text().includes('Download'))
      expect(downloadButton!.attributes()).toHaveProperty('disabled')

      const downloadTooltip = wrapper.findAll('.tooltip').find((t) => t.html().includes('Download'))
      expect(downloadTooltip!.attributes('data-tip')).toBe(
        'Fix configuration errors to download script',
      )
    })
  })
})
