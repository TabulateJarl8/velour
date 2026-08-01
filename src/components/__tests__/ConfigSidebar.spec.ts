import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ConfigSidebar from '@/components/ConfigSidebar.vue'
import PluginOptionsCard from '@/components/PluginOptionsCard.vue'
import type { CategoryGroup } from '@/composables/usePlugins'
import { PluginLoader } from '@/core/loader'
import { Categories } from '@/core/types'

import { createMockPlugin } from '../../../tests/utils'

vi.mock('@/core/loader', () => ({
  PluginLoader: {
    initializePluginConfig: vi.fn(() => ({ enabled: false })),
  },
}))

describe('ConfigSidebar', () => {
  const mock1 = createMockPlugin('p1', { description: 'cool description' })
  const mock2 = createMockPlugin('p2', { name: 'plugin 2' })

  const defaultProps = {
    isLoading: false,
    categorizedPlugins: [
      {
        name: Categories.System,
        pluginGroups: [
          {
            heading: 'File Sharing & Downloading',
            plugins: [mock1],
          },
          {
            heading: null,
            plugins: [mock2],
          },
        ],
      },
    ] as CategoryGroup[],
    quietMode: false,
    pluginConfigs: {
      p1: { enabled: true },
      p2: { enabled: false },
    },
  }

  beforeEach(() => {
    vi.mocked(PluginLoader.initializePluginConfig).mockClear()
    vi.spyOn(window, 'confirm').mockImplementation(() => false)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const createWrapper = (props = {}) => {
    return mount(ConfigSidebar, {
      props: { ...defaultProps, ...props },
      global: {
        stubs: {
          PluginOptionsCard: true,
        },
      },
    })
  }

  it('shows loading on isLoading', () => {
    const wrapper = createWrapper({ isLoading: true })
    expect(wrapper.text()).toContain('Loading plugins...')
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('renders categories and PluginOptionsCards', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('System Configuration')
    expect(wrapper.findAllComponents(PluginOptionsCard)).toHaveLength(2)
  })

  it('can search plugin names', async () => {
    const wrapper = createWrapper()
    const search = wrapper.find('input[placeholder="Search options..."]')
    await search.setValue('plugin 2')

    const cards = wrapper.findAllComponents(PluginOptionsCard)
    expect(cards).toHaveLength(1)
    expect(cards[0].props('plugin').id).toBe('p2')
    expect(wrapper.text()).toContain('1 match')
  })

  it('can search plugin descriptions', async () => {
    const wrapper = createWrapper()
    const search = wrapper.find('input[placeholder="Search options..."]')
    await search.setValue('cool')

    const cards = wrapper.findAllComponents(PluginOptionsCard)
    expect(cards).toHaveLength(1)
    expect(cards[0].props('plugin').id).toBe('p1')
  })

  it('handles no results in search', async () => {
    const wrapper = createWrapper()
    const search = wrapper.find('input[placeholder="Search options..."]')
    await search.setValue('NOTHING')

    expect(wrapper.text()).toContain('No options found matching "NOTHING"')
    expect(wrapper.findAllComponents(PluginOptionsCard)).toHaveLength(0)
  })

  it('updates quietMode', async () => {
    const wrapper = createWrapper({ quietMode: false })
    const quiteMode = wrapper.find('input[type="checkbox"]')
    await quiteMode.setValue(true)

    const event = wrapper.emitted('update:quietMode')
    expect(event).toBeTruthy()
    expect(event?.[0]).toEqual([true])
  })

  it('does nothing on clearOptions cancelled', async () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => false)
    const wrapper = createWrapper({ quietMode: true })

    const search = wrapper.find('input[placeholder="Search options..."]')
    await search.setValue('plugin')

    await wrapper
      .find('button[title="Reset all script configuration to defaults"]')
      .trigger('click')

    expect((search.element as HTMLInputElement).value).toBe('plugin')
    expect(wrapper.emitted('update:quietMode')).toBeUndefined()
    expect(PluginLoader.initializePluginConfig).not.toHaveBeenCalled()
  })

  it('resets configuration and query on clearOptions', async () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
    const wrapper = createWrapper({ quietMode: true })

    const search = wrapper.find('input[placeholder="Search options..."]')
    await search.setValue('plugin')

    await wrapper
      .find('button[title="Reset all script configuration to defaults"]')
      .trigger('click')

    expect((search.element as HTMLInputElement).value).toBe('')

    const event = wrapper.emitted('update:quietMode')
    expect(event).toBeTruthy()
    expect(event?.[event.length - 1]).toEqual([false])

    expect(PluginLoader.initializePluginConfig).toHaveBeenCalledWith(mock1)
    expect(PluginLoader.initializePluginConfig).toHaveBeenCalledWith(mock2)
  })

  it('ignores non-existant configurations on reset', async () => {
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
    const wrapper = createWrapper({
      pluginConfigs: { p1: { enabled: true } },
    })

    wrapper.find('button[title="Reset all script configuration to defaults"]')

    await wrapper
      .find('button[title="Reset all script configuration to defaults"]')
      .trigger('click')

    expect(PluginLoader.initializePluginConfig).toHaveBeenCalledTimes(1)
    expect(PluginLoader.initializePluginConfig).toHaveBeenCalledWith(mock1)
    expect(PluginLoader.initializePluginConfig).not.toHaveBeenCalledWith(mock2)
  })

  it('propegates plugin configuration change event from PluginOptionsCard', () => {
    const wrapper = createWrapper()
    const cards = wrapper.findAllComponents(PluginOptionsCard)

    const updated = { enabled: false, fun: 'new' }
    cards[0].vm.$emit('update:modelValue', updated)

    expect(wrapper.props('pluginConfigs').p1).toEqual(updated)
  })
})
