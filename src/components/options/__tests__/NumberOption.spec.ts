import type { NumberSubOption } from '@/core/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import NumberOption from '../NumberOption.vue'

describe('NumberOption', () => {
  const baseOptions: NumberSubOption = {
    type: 'number',
    label: 'Mock Label',
    min: 0,
    max: 10,
  }

  it('renders the label', () => {
    const wrapper = mount(NumberOption, { props: { modelValue: 1, opt: baseOptions } })

    expect(wrapper.text()).toContain('Mock Label')

    const input = wrapper.find('input')
    expect(input.element.type).toBe('number')
    expect(input.element.value).toBe('1')
  })

  it('renders with a description', () => {
    const wrapper = mount(NumberOption, {
      props: { modelValue: 1, opt: { ...baseOptions, description: 'Mock Description' } },
    })

    expect(wrapper.text()).toContain('Mock Label')
    expect(wrapper.text()).toContain('Mock Description')
  })

  it('emits update:modelValue on interaction', async () => {
    const wrapper = mount(NumberOption, { props: { modelValue: 1, opt: baseOptions } })

    await wrapper.find('input').setValue('5')

    const event = wrapper.emitted('update:modelValue')
    expect(event).toHaveLength(1)
    expect(event?.[0]).toEqual([5])
  })

  it('becomes errored on failed validation', async () => {
    const wrapper = mount(NumberOption, {
      props: {
        modelValue: 1,
        opt: {
          ...baseOptions,
          validate: (value) => (value === 1 ? 'Error' : true),
        },
      },
    })

    expect(wrapper.find('input').classes()).toContain('input-error')
  })

  it('becomes errored if input fails to parse as number (hypothetical)', async () => {
    const wrapper = mount(NumberOption, {
      props: {
        modelValue: 'u',
        // make anything valid so we hit the fallback line
        opt: { ...baseOptions, validate: () => true },
      },
    })

    expect(wrapper.find('input').classes()).toContain('input-error')
  })

  it('snaps to the min on blur', async () => {
    const wrapper = mount(NumberOption, { props: { modelValue: -5, opt: baseOptions } })

    await wrapper.find('input').trigger('blur')

    const event = wrapper.emitted('update:modelValue')
    expect(event?.[0]).toEqual([0])
  })

  it('snaps to the max on blur', async () => {
    const wrapper = mount(NumberOption, { props: { modelValue: 100, opt: baseOptions } })

    await wrapper.find('input').trigger('blur')

    const event = wrapper.emitted('update:modelValue')
    expect(event?.[0]).toEqual([10])
  })

  it('doesnt emit with bad input on blur', async () => {
    for (const bad of [undefined, null, '', 'bad']) {
      const wrapper = mount(NumberOption, {
        props: { modelValue: bad as unknown as number, opt: baseOptions },
      })

      await wrapper.find('input').trigger('blur')

      const event = wrapper.emitted('update:modelValue')
      expect(event).toBeUndefined()
    }
  })

  it('doesnt snap on blur with no min or max', async () => {
    const wrapper = mount(NumberOption, {
      props: {
        modelValue: 1,
        opt: {
          type: 'number',
          label: 'Mock Label',
        },
      },
    })

    await wrapper.find('input').trigger('blur')

    const event = wrapper.emitted('update:modelValue')
    expect(event).toBeUndefined()
  })

  describe('preventNonNumericInput', () => {
    it('prevents non-numerical input', () => {
      const wrapper = mount(NumberOption, { props: { modelValue: 1, opt: baseOptions } })

      const input = wrapper.find('input').element

      for (const key of ['a', ' ', '$']) {
        const e = new KeyboardEvent('keydown', { key, cancelable: true })
        const spy = vi.spyOn(e, 'preventDefault')
        input.dispatchEvent(e)

        expect(spy).toHaveBeenCalled()
      }
    })

    it('allows action keys', () => {
      const wrapper = mount(NumberOption, { props: { modelValue: 1, opt: baseOptions } })

      const input = wrapper.find('input').element
      const e = new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true })
      const spy = vi.spyOn(e, 'preventDefault')

      input.dispatchEvent(e)
      expect(spy).not.toHaveBeenCalled()
    })

    it('allows keyboard shortcuts', () => {
      const wrapper = mount(NumberOption, { props: { modelValue: 1, opt: baseOptions } })

      const input = wrapper.find('input').element
      const e = new KeyboardEvent('keydown', { key: 'c', ctrlKey: true, cancelable: true })
      const spy = vi.spyOn(e, 'preventDefault')

      input.dispatchEvent(e)
      expect(spy).not.toHaveBeenCalled()
    })

    it('allows numerics and minus sign', () => {
      const wrapper = mount(NumberOption, { props: { modelValue: 1, opt: baseOptions } })

      const input = wrapper.find('input').element

      for (const key of ['0', '5', '8', '-']) {
        const e = new KeyboardEvent('keydown', { key, cancelable: true })
        const spy = vi.spyOn(e, 'preventDefault')
        input.dispatchEvent(e)

        expect(spy).not.toHaveBeenCalled()
      }
    })
  })
})
