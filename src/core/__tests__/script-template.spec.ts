import { readFile } from 'fs/promises'
import { describe, expect, it } from 'vitest'

describe('Bash Script Template Validity', async () => {
  it('is valid bash', async () => {
    const scriptTemplate = await readFile(`${__dirname}/../script_template.sh`, 'utf-8')
    expect(scriptTemplate).toBeValidBash()
  })

  it('contains the template replacement string', async () => {
    const scriptTemplate = await readFile(`${__dirname}/../script_template.sh`, 'utf-8')
    expect(scriptTemplate).toContain('# {{script_body}}')
  })
})
