import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import type { DropdownSubOption } from '@/core/types'

import DropdownOption from '../DropdownOption.vue'

describe('DropdownOption', () => {
  const baseOptions: DropdownSubOption = {
    type: 'dropdown',
    label: 'Mock Label',
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ],
    default: 'opt1',
  }

  it('renders the label', () => {
    const wrapper = mount(DropdownOption, { props: { modelValue: 'opt1', opt: baseOptions } })

    expect(wrapper.text()).toContain('Mock Label')

    // 1 placeholder + 2 options
    expect(wrapper.findAll('option')).toHaveLength(3)
    expect(wrapper.find('select').element.value).toBe('opt1')
  })

  it('renders with a description', () => {
    const wrapper = mount(DropdownOption, {
      props: { modelValue: 'opt1', opt: { ...baseOptions, description: 'Mock Description' } },
    })

    expect(wrapper.text()).toContain('Mock Label')
    expect(wrapper.text()).toContain('Mock Description')
  })

  it('emits update:modelValue on interaction', async () => {
    const wrapper = mount(DropdownOption, { props: { modelValue: 'opt1', opt: baseOptions } })

    await wrapper.find('select').setValue('opt2')

    const event = wrapper.emitted('update:modelValue')
    expect(event).toHaveLength(1)
    expect(event?.[0]).toEqual(['opt2'])
  })

  it('becomes errored on failed validation', () => {
    const wrapper = mount(DropdownOption, {
      props: {
        modelValue: 'opt1',
        opt: {
          ...baseOptions,
          validate: (value) => (value === 'opt1' ? 'Error' : true),
        },
      },
    })

    expect(wrapper.find('select').classes()).toContain('select-error')
  })
})
