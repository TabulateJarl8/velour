import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'

import { createMockPlugin } from '../../../tests/utils'
import { usePlugins } from '../usePlugins'

const { deserializeConfig, mockLoggerError, extractPayloadFromScript } = vi.hoisted(() => ({
  deserializeConfig: vi.fn().mockResolvedValue({ configs: { mock: {} } }),
  mockLoggerError: vi.fn(),
  extractPayloadFromScript: vi.fn().mockReturnValue('base64'),
}))

vi.mock('@/core/loader', () => {
  const mock1 = createMockPlugin('mock-1', {
    category: 'Additional Applications',
    heading: 'Internet & Communication',
    dependencies: ['mock-2' as never],
    options: {
      text: { type: 'text', label: 'fun', required: true },
      num: { type: 'number', label: 'NUMBER', min: -3, max: 10 },
      check: { type: 'checkbox', label: 'coopl', validate: (v) => (v ? true : 'error') },
      radio: { type: 'radio', label: 'radio', options: [{ label: '1', value: '1' }], default: '1' },
      dropdown: {
        type: 'dropdown',
        label: 'drop',
        options: [{ label: '1', value: '1' }],
        default: '1',
      },
    },
  })

  const mock2 = createMockPlugin('mock-2', {
    category: 'System Configuration',
  })

  return {
    PluginLoader: vi.fn(
      class {
        static initializePluginConfig = vi.fn().mockReturnValue(mock1)

        loadPlugins = vi.fn().mockResolvedValue(true)
        getPlugins = vi.fn().mockReturnValue([mock1, mock2])
      },
    ),
  }
})

vi.mock('@/core/scriptGenerator', () => ({
  buildPluginScripts: vi.fn().mockReturnValue('# MOCK SCRIPT'),
  generateFullScript: vi.fn().mockReturnValue('# MOCK FULL'),
}))

vi.mock('@/core/configSerde', () => ({
  serializeConfig: vi.fn().mockResolvedValue('base64'),
  deserializeConfig,
  extractPayloadFromScript,
}))

vi.mock('@/core/logger', () => ({
  logger: {
    error: mockLoggerError,
  },
}))

vi.stubGlobal('alert', vi.fn())
window.URL.createObjectURL = vi.fn()
window.URL.revokeObjectURL = vi.fn()

const MockComponent = defineComponent({
  setup() {
    const pluginState = usePlugins()
    return { ...pluginState }
  },
  template: '<div></div>',
})

describe('usePlugins', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.location.hash = ''
  })

  it('loads plugins on component mount', async () => {
    const wrapper = mount(MockComponent)
    expect(wrapper.vm.isLoading).toBe(true)

    expect(wrapper.vm.generatedScript).toBe('# Loading plugins...')

    await flushPromises()

    expect(wrapper.vm.isLoading).toBe(false)
    expect(wrapper.vm.generatedScript).toBe('# MOCK SCRIPT')
  })

  describe('fragment loading', () => {
    it('loads a script from a url fragment', async () => {
      window.location.hash = '#mockHash'

      const wrapper = mount(MockComponent)
      await flushPromises()

      expect(deserializeConfig).toHaveBeenCalledWith('mockHash')
      expect(wrapper.vm.quietMode).toBe(false)
    })

    it('catches url fragment deserialization errors', async () => {
      window.location.hash = '#mockHash'

      const error = new Error()
      deserializeConfig.mockRejectedValueOnce(error)

      mount(MockComponent)
      await flushPromises()

      expect(deserializeConfig).toHaveBeenCalledWith('mockHash')
      expect(mockLoggerError).toHaveBeenCalledWith(
        'Failed to decompress or parse fragment data',
        error,
      )
    })

    it('restores a quiet mode script', async () => {
      window.location.hash = '#mockHash'

      deserializeConfig.mockReturnValueOnce({ configs: { 'mock-1': {} }, quietMode: true })

      const wrapper = mount(MockComponent)
      await flushPromises()

      expect(deserializeConfig).toHaveBeenCalledWith('mockHash')
      expect(wrapper.vm.quietMode).toBe(true)
    })

    it('ignores plugins that have been removed', async () => {
      window.location.hash = '#mockHash'

      deserializeConfig.mockReturnValueOnce({ configs: { notReal: {} } })

      const wrapper = mount(MockComponent)
      await flushPromises()

      expect(deserializeConfig).toHaveBeenCalledWith('mockHash')
      expect(wrapper.vm.quietMode).toBe(false)
    })

    it('does nothing on malformed saveState', async () => {
      window.location.hash = '#mockHash'

      deserializeConfig.mockReturnValueOnce({ notReal: true })

      const wrapper = mount(MockComponent)
      await flushPromises()

      expect(deserializeConfig).toHaveBeenCalledWith('mockHash')
      expect(wrapper.vm.quietMode).toBe(false)
    })
  })

  describe('categorizedPlugins', () => {
    it('groups plugins correctly', async () => {
      const wrapper = mount(MockComponent)
      await flushPromises()

      const apps = wrapper.vm.categorizedPlugins.find((c) => c.name === 'Additional Applications')
      expect(apps?.pluginGroups[0].heading).toBe('Internet & Communication')
      expect(apps?.pluginGroups[0].plugins[0].id).toBe('mock-1')

      const system = wrapper.vm.categorizedPlugins.find((c) => c.name === 'System Configuration')
      expect(system?.pluginGroups[0].heading).toBeNull()
      expect(system?.pluginGroups[0].plugins[0].id).toBe('mock-2')
    })
  })

  describe('validationErrors', () => {
    it('returns no errors on load', () => {
      const wrapper = mount(MockComponent)
      expect(wrapper.vm.validationErrors).toEqual({})
    })

    it('validates options properly', async () => {
      const wrapper = mount(MockComponent)
      await flushPromises()

      wrapper.vm.pluginConfigs = {
        'mock-1': {
          enabled: true,
          text: 'valid',
          num: 5,
          check: true,
        },
      }

      expect(wrapper.vm.validationErrors).toEqual({})

      wrapper.vm.pluginConfigs['mock-1'].text = ''
      expect(wrapper.vm.validationErrors['mock-1']).toContain('missing required input')
      wrapper.vm.pluginConfigs['mock-1'].text = 'valid' // fix

      wrapper.vm.pluginConfigs['mock-1'].num = -100
      expect(wrapper.vm.validationErrors['mock-1']).toContain('at least -3')

      wrapper.vm.pluginConfigs['mock-1'].num = 100
      expect(wrapper.vm.validationErrors['mock-1']).toContain('at most 10')

      // @ts-expect-error -- testing
      wrapper.vm.pluginConfigs['mock-1'].num = null
      expect(wrapper.vm.validationErrors['mock-1']).toContain('missing or invalid numeric value')
      wrapper.vm.pluginConfigs['mock-1'].num = 5 // fix

      wrapper.vm.pluginConfigs['mock-1'].check = false
      expect(wrapper.vm.validationErrors['mock-1']).toContain('error')
    })
  })

  describe('generatePermalink', () => {
    it('returns current href when loading', async () => {
      const wrapper = mount(MockComponent)
      const url = await wrapper.vm.generatePermalink()
      expect(url).toBe(window.location.href)
    })

    it('generates permalink', async () => {
      const wrapper = mount(MockComponent)
      await flushPromises()

      const url = await wrapper.vm.generatePermalink()
      expect(url).toContain('#base64')
    })
  })

  describe('downloadScript', () => {
    it('downloads the script', async () => {
      const wrapper = mount(MockComponent)
      await flushPromises()

      const anchor = {
        href: '',
        style: { display: '' },
        download: '',
        click: vi.fn(),
      } as unknown as HTMLAnchorElement
      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(anchor)
      const appendChildSpy = vi
        .spyOn(document.body, 'appendChild')
        .mockImplementation(() => null as never)
      const removeChildSpy = vi
        .spyOn(document.body, 'removeChild')
        .mockImplementation(() => null as never)

      await wrapper.vm.downloadScript()

      expect(createElementSpy).toHaveBeenCalledWith('a')
      expect(anchor.click).toHaveBeenCalled()
      expect(anchor.download).toBe('velour_fedora_setup.sh')

      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })

    it('doesnt download with validation errors', async () => {
      const wrapper = mount(MockComponent)
      await flushPromises()

      wrapper.vm.pluginConfigs = { 'mock-1': { enabled: true, textOpt: '' } }
      const createElementSpy = vi.spyOn(document, 'createElement')

      await wrapper.vm.downloadScript()
      expect(createElementSpy).not.toHaveBeenCalled()
      createElementSpy.mockRestore()
    })
  })

  describe('importScript', () => {
    it('alerts if state not found', async () => {
      const wrapper = mount(MockComponent)
      await flushPromises()

      extractPayloadFromScript.mockReturnValueOnce(null)
      const mockFile = new File(['mock'], 'thing.sh')
      mockFile.text = vi.fn().mockResolvedValue('text')

      await wrapper.vm.importScript(mockFile)

      expect(window.alert).toHaveBeenCalledWith('No Velour configuration was found in this script')
    })

    it('applies config of valid script', async () => {
      const wrapper = mount(MockComponent)
      await flushPromises()

      const mockFile = new File(['mock'], 'script.sh')
      mockFile.text = vi.fn().mockResolvedValue('text')

      await wrapper.vm.importScript(mockFile)

      expect(deserializeConfig).toHaveBeenCalledWith('base64')
    })

    it('alerts on malformed payload', async () => {
      const wrapper = mount(MockComponent)
      await flushPromises()

      const mockFile = new File(['mock'], 'script.sh')
      mockFile.text = vi.fn().mockResolvedValue('text')

      const error = new Error()
      deserializeConfig.mockRejectedValueOnce(error)

      await wrapper.vm.importScript(mockFile)

      expect(mockLoggerError).toHaveBeenCalledWith('Failed to parse uploaded script: ', error)
      expect(window.alert).toHaveBeenCalledWith('Invalid or corrupted script configuration')
    })
  })
})
