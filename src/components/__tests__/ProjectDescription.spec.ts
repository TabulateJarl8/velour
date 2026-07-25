import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import ProjectDescription from '../ProjectDescription.vue'

describe('ProjectDescription', () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn()
  })

  afterEach(() => vi.restoreAllMocks())

  it('renders correctly', () => {
    const wrapper = mount(ProjectDescription)

    expect(wrapper.text()).toContain('About Velour')
    expect(wrapper.text()).toContain('Velour is')
  })

  it('can be shown', () => {
    const wrapper = mount(ProjectDescription)
    wrapper.vm.showModal()

    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledOnce()
  })
})
