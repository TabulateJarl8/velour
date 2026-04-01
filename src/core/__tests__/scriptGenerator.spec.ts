import { describe, expect, it } from 'vitest'
import { generateFullScript } from '../scriptGenerator'
import { version } from '../../../package.json'

describe('Bash Script Template Validity', async () => {
  it('replaces the template replacement string', async () => {
    const generated = generateFullScript([], {}, {}, false)
    expect(generated).not.toContain('# {{script_body}}')
  })

  it('replaces the version replacement string', async () => {
    const generated = generateFullScript([], {}, {}, false)
    expect(generated).not.toContain('__VELOUR_VERSION__')
    expect(generated).toContain(`VELOUR_VERSION="${version}"`)
  })

  it('warns about bad configs before running', async () => {
    const generated = generateFullScript([], {}, { 'bad-config': 'MOCK ERR' }, false)
    expect(generated).toContain(' - bad-config')
    expect(generated).toContain(
      'WARNING: The following plugins had configuration errors and were excluded from the script:',
    )
  })

  it('does not warn if there are no errors', async () => {
    const generated = generateFullScript([], {}, {}, false)
    expect(generated).not.toContain(
      'WARNING: The following plugins had configuration errors and were excluded from the script:',
    )
  })
})
