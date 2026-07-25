import { describe, expect, it } from 'vitest'

import plugin from '../customization/microsoft-fonts'

describe('microsoft-fonts', () => {
  it('warns the user when official windows fonts are selected', () => {
    const config = { enabled: true, installType: 'windows' }
    const alertMessage = plugin.alerts?.(config)
    expect(alertMessage?.type).toBe('warning')
    expect(alertMessage?.message).not.toHaveLength(0)
  })

  it('doesnt warn the user when core ms fonts are selected', () => {
    const config = { enabled: true, installType: 'core' }
    const alertMessage = plugin.alerts?.(config)
    expect(alertMessage).toBeUndefined()
  })

  it('catch invalid installTypes', () => {
    const config = { enabled: true, installType: 'bad' }
    const script = plugin.generate(config)

    expect(script).toContain('# (Microsoft Fonts) INVALID INSTALLATION TYPE: bad')
  })
})
