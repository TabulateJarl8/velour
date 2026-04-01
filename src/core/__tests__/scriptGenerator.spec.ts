import { describe, expect, it } from 'vitest'
import { buildPluginScripts, buildSinglePluginScript, generateFullScript } from '../scriptGenerator'
import { version } from '../../../package.json'
import { createMockPlugin } from '../../../tests/utils'

describe('scriptGenerator', () => {
  describe('buildSinglePluginScript', () => {
    it('generates a basic script', () => {
      const plugin = createMockPlugin('mock', {
        name: 'test',
        preRunMessage: 'Running test...',
        postRunMessage: 'done test',
        generate: () => `
          echo line1
            echo line2
        `,
      })
      const script = buildSinglePluginScript(plugin, { enabled: true }, false, false)

      expect(script).toContain('# --- [Plugin] test ---')
      expect(script).toContain('Running test...')
      expect(script).toContain('done test')
      // should be unformatted
      expect(script).toContain('echo line1\n  echo line2')
    })

    it('generates a quiet mode script', () => {
      const plugin = createMockPlugin('mock', { generate: () => 'echo test' })
      const script = buildSinglePluginScript(plugin, { enabled: true }, false, true)

      expect(script).toContain('{\necho test\n}>/dev/null')
      expect(script).not.toContain('color_echo')
    })

    it('comments out plugins with errors', () => {
      const plugin = createMockPlugin('mock', { generate: () => 'echo test' })
      const script = buildSinglePluginScript(plugin, { enabled: true }, true, false)

      expect(script).toMatch(/^# echo test/m)
    })

    it('trims the script if plugin only generates whitespace', () => {
      const plugin = createMockPlugin('mock', {
        generate: () => '    \n   \n   ',
      })
      const script = buildSinglePluginScript(plugin, { enabled: true }, false, true)

      expect(script).toContain('{\n\n}>/dev/null')
    })
  })

  describe('buildPluginScripts', () => {
    it('handles large numbers', () => {
      const plugin = createMockPlugin('mock', {
        options: { num: { type: 'number', label: 'test' } },
        generate: (config) => `echo "${config.num}"`,
      })

      const config = { mock: { enabled: true, num: 3.141592653589793 } }
      const script = buildPluginScripts([plugin], config, {}, false)

      expect(script).toContain('echo "3.141592653589793"')
    })

    it('handles non-numbers', () => {
      const plugin = createMockPlugin('mock', {
        options: { text: { type: 'text', label: 'test', required: false } },
        generate: (config) => `echo "${config.text}"`,
      })

      const config = { mock: { enabled: true, text: 'cool' } }
      const script = buildPluginScripts([plugin], config, {}, false)

      expect(script).toContain('echo "cool"')
    })

    it('combines multiple plugins', () => {
      const a = createMockPlugin('a', { generate: () => 'echo a' })
      const b = createMockPlugin('b', { generate: () => 'echo b' })

      const config = {
        a: { enabled: true },
        b: { enabled: true },
      }

      const script = buildPluginScripts([a, b], config, {}, false)
      expect(script).toContain('echo a')
      expect(script).toContain('echo b')
    })

    it('handles dependencies', () => {
      const a = createMockPlugin('a', { dependencies: ['b' as never], generate: () => 'echo a' })
      const b = createMockPlugin('b', { generate: () => 'echo b' })

      const config = {
        a: { enabled: true },
        b: { enabled: false },
      }

      const script = buildPluginScripts([a, b], config, {}, false)
      expect(script).toContain('echo a')
      expect(script).toContain('echo b')
    })
  })

  describe('generateFullScript', () => {
    it('replaces the template replacement string', () => {
      const generated = generateFullScript([], {}, {}, false)
      expect(generated).not.toContain('# {{script_body}}')
    })

    it('replaces the version replacement string', () => {
      const generated = generateFullScript([], {}, {}, false)
      expect(generated).not.toContain('__VELOUR_VERSION__')
      expect(generated).toContain(`VELOUR_VERSION="${version}"`)
    })

    it('warns about bad configs before running', () => {
      const generated = generateFullScript([], {}, { 'bad-config': 'MOCK ERR' }, false)
      expect(generated).toContain(' - bad-config')
      expect(generated).toContain(
        'WARNING: The following plugins had configuration errors and were excluded from the script:',
      )
    })

    it('does not warn if there are no errors', () => {
      const generated = generateFullScript([], {}, {}, false)
      expect(generated).not.toContain(
        'WARNING: The following plugins had configuration errors and were excluded from the script:',
      )
    })

    it('handles errored plugins', () => {
      const plugin = createMockPlugin('mock', { name: 'Mock' })
      const errors = {
        mock: 'err',
        // this is a fake plugin to test fallback to plugin id if not present in plugin array
        'not-real': 'bad',
      }

      const script = generateFullScript([plugin], {}, errors, false)

      expect(script).toContain('WARNING:')
      expect(script).toContain(' - Mock')
      // should fall back to plugin id
      expect(script).toContain(' - not-real')
    })
  })
})
