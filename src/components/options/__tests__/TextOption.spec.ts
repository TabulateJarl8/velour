import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import type { TextSubOption } from '@/core/types'

import TextOption from '../TextOption.vue'

describe('TextOption', () => {
  const baseOptions: TextSubOption = {
    type: 'text',
    label: 'Mock Label',
    required: false,
  }

  it('renders the label', () => {
    const wrapper = mount(TextOption, { props: { modelValue: 'test', opt: baseOptions } })

    expect(wrapper.text()).toContain('Mock Label')

    const input = wrapper.find('input')
    expect(input.element.type).toBe('text')
    expect(input.element.value).toBe('test')
  })

  it('renders with a description', () => {
    const wrapper = mount(TextOption, {
      props: { modelValue: '', opt: { ...baseOptions, description: 'Mock Description' } },
    })

    expect(wrapper.text()).toContain('Mock Label')
    expect(wrapper.text()).toContain('Mock Description')
  })

  it('renders with a placeholder', () => {
    const wrapper = mount(TextOption, {
      props: { modelValue: '', opt: { ...baseOptions, placeholder: 'placeholder' } },
    })

    expect(wrapper.find('input').element.placeholder).toEqual('placeholder')
  })

  it('emits update:modelValue on interaction', async () => {
    const wrapper = mount(TextOption, { props: { modelValue: '', opt: baseOptions } })

    await wrapper.find('input').setValue('cool')

    const event = wrapper.emitted('update:modelValue')
    expect(event).toHaveLength(1)
    expect(event?.[0]).toEqual(['cool'])
  })

  it('becomes errored on failed validation', () => {
    const wrapper = mount(TextOption, {
      props: {
        modelValue: '',
        opt: {
          ...baseOptions,
          validate: (value) => (value.length === 0 ? 'Error' : true),
        },
      },
    })

    expect(wrapper.find('input').classes()).toContain('input-error')
  })

  it('allows action keys', () => {
    const wrapper = mount(TextOption, { props: { modelValue: '', opt: baseOptions } })

    const input = wrapper.find('input').element
    const e = new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true })
    const spy = vi.spyOn(e, 'preventDefault')

    input.dispatchEvent(e)
    expect(spy).not.toHaveBeenCalled()
  })

  it('allows keyboard shortcuts', () => {
    const wrapper = mount(TextOption, { props: { modelValue: '', opt: baseOptions } })

    const input = wrapper.find('input').element
    const e = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, cancelable: true })
    const spy = vi.spyOn(e, 'preventDefault')

    input.dispatchEvent(e)
    expect(spy).not.toHaveBeenCalled()
  })

  it('allows typing characters', () => {
    const wrapper = mount(TextOption, { props: { modelValue: '', opt: baseOptions } })

    const input = wrapper.find('input').element

    for (const key of ['0', 'a', 'G', '-', '$', '°']) {
      const e = new KeyboardEvent('keydown', { key, cancelable: true })
      const spy = vi.spyOn(e, 'preventDefault')
      input.dispatchEvent(e)

      expect(spy).not.toHaveBeenCalled()
    }
  })
})
