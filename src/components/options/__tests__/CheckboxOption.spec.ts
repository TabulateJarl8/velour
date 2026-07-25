import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { CheckboxSubOption } from '@/core/types'

import CheckboxOption from '../CheckboxOption.vue'

describe('CheckboxOption', () => {
  const baseOptions: CheckboxSubOption = {
    type: 'checkbox',
    label: 'Mock Label',
  }

  it('renders the label', () => {
    const wrapper = mount(CheckboxOption, { props: { modelValue: true, opt: baseOptions } })

    expect(wrapper.text()).toContain('Mock Label')

    const input = wrapper.find('input')
    expect(input.element.type).toBe('checkbox')
    expect(input.element.value).toBe('on')
  })

  it('renders with a description', () => {
    const wrapper = mount(CheckboxOption, {
      props: { modelValue: true, opt: { ...baseOptions, description: 'Mock Description' } },
    })

    expect(wrapper.text()).toContain('Mock Label')
    expect(wrapper.text()).toContain('Mock Description')
  })

  it('emits update:modelValue on interaction', async () => {
    const wrapper = mount(CheckboxOption, { props: { modelValue: false, opt: baseOptions } })

    await wrapper.find('input').setValue(true)

    const event = wrapper.emitted('update:modelValue')
    expect(event).toHaveLength(1)
    expect(event?.[0]).toEqual([true])
  })

  it('becomes errored on failed validation', async () => {
    const wrapper = mount(CheckboxOption, {
      props: {
        modelValue: false,
        opt: {
          ...baseOptions,
          validate: (value) => (value === false ? 'Error' : true),
        },
      },
    })

    expect(wrapper.find('input').classes()).toContain('checkbox-error')
  })
})
