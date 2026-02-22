import { describe, expect, it } from 'vitest'
import { generateFullScript } from '../scriptGenerator'
import { version } from '../../../package.json'

describe('Bash Script Template Validity', async () => {
  it('replaces the template replacement string', async () => {
    const generated = generateFullScript([], {}, false)
    expect(generated).not.toContain('# {{script_body}}')
  })

  it('replaces the version replacement string', async () => {
    const generated = generateFullScript([], {}, false)
    expect(generated).not.toContain('__VELOUR_VERSION__')
    expect(generated).toContain(`VELOUR_VERSION="${version}"`)
  })
})
