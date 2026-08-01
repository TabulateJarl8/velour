import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'

import App from '@/App.vue'
import ConfigSidebar from '@/components/ConfigSidebar.vue'
import ScriptPreview from '@/components/ScriptPreview.vue'

const { mockCopy, generatePermalink, mockLoggerError } = vi.hoisted(() => ({
  mockCopy: vi.fn(),
  generatePermalink: vi.fn().mockResolvedValue('https://velour.tabulate.tech#mock'),
  mockLoggerError: vi.fn(),
}))

vi.mock('@/core/logger', () => ({
  logger: {
    error: mockLoggerError,
  },
}))

vi.mock('@/composables/usePlugins', () => ({
  usePlugins: () => ({
    isLoading: ref(true),
    pluginConfigs: ref({}),
    quietMode: ref(false),
    categorizedPlugins: ref([]),
    generatedScript: ref(''),
    validationErrors: ref({}),
    downloadScript: vi.fn(),
    generatePermalink,
    importScript: vi.fn(),
  }),
}))

vi.mock('@vueuse/core', async (importOriginal) => {
  const vueuse = await importOriginal<typeof import('@vueuse/core')>()
  return {
    ...vueuse,
    useClipboard: () => ({
      copy: mockCopy,
      copied: ref(false),
    }),
  }
})

describe('App', () => {
  const mountOpts = {
    global: {
      stubs: {
        ConfigSidebar: true,
        ScriptPreview: true,
        ProjectDescription: true,
      },
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('mounts the proper components', () => {
    const wrapper = mount(App, mountOpts)

    const sidebar = wrapper.findComponent(ConfigSidebar)
    const preview = wrapper.findComponent(ScriptPreview)

    expect(sidebar.exists()).toBe(true)
    expect(preview.exists()).toBe(true)
  })

  it('copies permalink to clipboard', async () => {
    const wrapper = mount(App, mountOpts)

    wrapper.findComponent(ScriptPreview).vm.$emit('copy-permalink')
    await flushPromises()

    expect(generatePermalink).toHaveBeenCalled()
    expect(mockCopy).toHaveBeenCalledWith('https://velour.tabulate.tech#mock')
  })

  it('handles errors in permalink generation', async () => {
    const error = new Error()
    generatePermalink.mockRejectedValueOnce(error)

    const wrapper = mount(App, mountOpts)

    wrapper.findComponent(ScriptPreview).vm.$emit('copy-permalink')
    await flushPromises()

    expect(generatePermalink).toHaveBeenCalled()
    expect(mockCopy).not.toHaveBeenCalled()
    expect(mockLoggerError).toHaveBeenCalledWith('Could not copy permalink: ', error)
  })

  it('can open the about modal', async () => {
    const showModal = vi.fn()
    const wrapper = mount(App, {
      global: {
        stubs: {
          ...mountOpts.global.stubs,
          ProjectDescription: {
            template: '<div></div>',
            methods: { showModal },
          },
        },
      },
    })

    const button = wrapper.findAll('button').find((b) => b.text() === 'About')
    expect(button?.exists()).toBe(true)
    button?.trigger('click')
    await flushPromises()

    expect(showModal).toHaveBeenCalledOnce()
  })

  it('updates quietMode on v-model update', async () => {
    const wrapper = mount(App, mountOpts)

    const sidebar = wrapper.findComponent(ConfigSidebar)

    expect(sidebar.props('quietMode')).toBe(false)

    sidebar.vm.$emit('update:quietMode', true)
    await flushPromises()

    expect(sidebar.props('quietMode')).toBe(true)
  })

  it('updates pluginConfigs on v-model update', async () => {
    const wrapper = mount(App, mountOpts)

    const sidebar = wrapper.findComponent(ConfigSidebar)

    expect(sidebar.props('pluginConfigs')).toEqual({})

    const config = { mock: { enabled: true } }
    sidebar.vm.$emit('update:pluginConfigs', config)
    await flushPromises()

    expect(sidebar.props('pluginConfigs')).toEqual(config)
  })
})
