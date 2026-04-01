import type { RadioSubOption } from '@/core/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RadioOption from '../RadioOption.vue'

describe('RadioOption', () => {
  const baseOptions: RadioSubOption = {
    type: 'radio',
    label: 'Mock Label',
    options: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ],
    default: 'opt1',
  }

  it('renders the label', () => {
    const wrapper = mount(RadioOption, { props: { modelValue: 'opt1', opt: baseOptions } })

    expect(wrapper.text()).toContain('Mock Label')

    // 2 options
    expect(wrapper.findAll('input')).toHaveLength(2)
  })

  it('renders with a description', () => {
    const wrapper = mount(RadioOption, {
      props: { modelValue: 'opt1', opt: { ...baseOptions, description: 'Mock Description' } },
    })

    expect(wrapper.text()).toContain('Mock Label')
    expect(wrapper.text()).toContain('Mock Description')
  })

  it('emits update:modelValue on interaction', async () => {
    const wrapper = mount(RadioOption, { props: { modelValue: 'opt1', opt: baseOptions } })

    // opt2 is 2nd button
    await wrapper.findAll('input')[1].setValue(true)

    const event = wrapper.emitted('update:modelValue')
    expect(event).toHaveLength(1)
    expect(event?.[0]).toEqual(['opt2'])
  })

  it('becomes errored on failed validation', async () => {
    const wrapper = mount(RadioOption, {
      props: {
        modelValue: 'opt1',
        opt: {
          ...baseOptions,
          validate: (value) => (value === 'opt1' ? 'Error' : true),
        },
      },
    })

    wrapper.findAll('input').forEach((i) => {
      expect(i.classes()).toContain('radio-error')
    })
  })
})
