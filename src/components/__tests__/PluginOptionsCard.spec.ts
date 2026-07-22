import { describe, expect, it, vi } from 'vitest'
import PluginOptionsCard from '../PluginOptionsCard.vue'
import { createMockPlugin } from '../../../tests/utils'
import type { ConcretePluginConfig } from '@/core/types'
import { mount } from '@vue/test-utils'

describe('PluginOptionsCard', () => {
  const getWrapper = (plugin = {}, config = {}) => {
    const mockPlugin = createMockPlugin('mock', {
      options: {
        text: { type: 'text', label: 'text', required: true },
        checkbox: { type: 'checkbox', label: 'checkbox' },
      },
    })

    const mockConfig: ConcretePluginConfig = {
      enabled: false,
      text: 'value',
      checkbox: true,
    }

    return mount(PluginOptionsCard, {
      props: {
        plugin: { ...mockPlugin, ...plugin },
        modelValue: { ...mockConfig, ...config },
      },
    })
  }

  it('renders plugin info', () => {
    const wrapper = getWrapper()

    expect(wrapper.text()).toContain('mock plugin')
    expect(wrapper.text()).toContain('mock description')
  })

  it('can toggle enabled', async () => {
    const wrapper = getWrapper()
    // enabling checkbox is first item
    const button = wrapper.findAll('input[type="checkbox"]')[0]

    expect(wrapper.props('modelValue').enabled).toBe(false)
    await button.setValue(true)
    expect(wrapper.props('modelValue').enabled).toBe(true)
  })

  it('emits update:modalValue on interaction', async () => {
    const wrapper = getWrapper()
    await wrapper.find('input[type="text"]').setValue('cool')
    expect(wrapper.props('modelValue').text).toBe('cool')
  })

  it('renders plugin options', () => {
    const wrapper = getWrapper()

    const options = wrapper.findAll('.form-control')
    expect(options).toHaveLength(2)
  })

  it('renders plugins with no options', () => {
    const wrapper = getWrapper({ options: {} })

    const options = wrapper.findAll('.form-control')
    expect(options).toHaveLength(0)
  })

  it('renders error alerts properly', () => {
    const wrapper = getWrapper({
      alerts: vi.fn(() => ({ type: 'error', message: 'bad' })),
    })

    const alert = wrapper.find('[role="alert"]')

    expect(alert.text()).toContain('bad')
    expect(alert.classes()).toContain('alert-error')
  })

  it('renders warning alerts properly', () => {
    const wrapper = getWrapper({
      alerts: vi.fn(() => ({ type: 'warning', message: 'bad' })),
    })

    const alert = wrapper.find('[role="alert"]')

    expect(alert.text()).toContain('bad')
    expect(alert.classes()).toContain('alert-warning')
  })

  it('renders info alerts properly', () => {
    const wrapper = getWrapper({
      alerts: vi.fn(() => ({ type: 'info', message: 'bad' })),
    })

    const alert = wrapper.find('[role="alert"]')

    expect(alert.text()).toContain('bad')
    expect(alert.classes()).toContain('alert-info')
  })

  it('renders success alerts properly', () => {
    const wrapper = getWrapper({
      alerts: vi.fn(() => ({ type: 'success', message: 'bad' })),
    })

    const alert = wrapper.find('[role="alert"]')

    expect(alert.text()).toContain('bad')
    expect(alert.classes()).toContain('alert-success')
  })
})
