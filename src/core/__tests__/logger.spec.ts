import { afterEach, beforeEach, describe, expect,it, vi } from 'vitest'

import { logger } from '../logger'

describe('logger', () => {
  let spy: ReturnType<typeof vi.spyOn>

  describe('browser', () => {
    // suppress output
    beforeEach(() => {
      spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    })

    afterEach(() => {
      spy.mockRestore()
    })

    it('logs info correctly', () => {
      logger.info('message')

      expect(spy).toHaveBeenCalled()
      const calls = spy.mock.calls[0]

      expect(calls[0]).toContain('[Velour]')
      expect(calls[0]).toContain('INFO')
      expect(calls[calls.length - 1]).toContain('message')
    })

    it('logs warnings correctly', () => {
      logger.warning('message')

      expect(spy).toHaveBeenCalled()
      const calls = spy.mock.calls[0]

      expect(calls[0]).toContain('[Velour]')
      expect(calls[0]).toContain('WARN')
      expect(calls[calls.length - 1]).toContain('message')
    })

    it('logs errors correctly', () => {
      logger.error('message')

      expect(spy).toHaveBeenCalled()
      const calls = spy.mock.calls[0]

      expect(calls[0]).toContain('[Velour]')
      expect(calls[0]).toContain('ERROR')
      expect(calls[calls.length - 1]).toContain('message')
    })

    it('logs success correctly', () => {
      logger.success('message')

      expect(spy).toHaveBeenCalled()
      const calls = spy.mock.calls[0]

      expect(calls[0]).toContain('[Velour]')
      expect(calls[0]).toContain('SUCCESS')
      expect(calls[calls.length - 1]).toContain('message')
    })
  })

  describe('server', () => {
    // suppress output
    beforeEach(() => {
      spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      // pretend we're in a server env
      vi.stubGlobal('window', undefined)
    })

    afterEach(() => {
      spy.mockRestore()
      vi.unstubAllGlobals()
    })

    it('logs info correctly', () => {
      logger.info('message')

      expect(spy).toHaveBeenCalled()
      const calls = spy.mock.calls[0]

      expect(calls[0]).toContain('[Velour]')
      expect(calls[1]).toContain('INFO')
      expect(calls[2]).toContain('message')
    })

    it('logs warnings correctly', () => {
      logger.warning('message')

      expect(spy).toHaveBeenCalled()
      const calls = spy.mock.calls[0]

      expect(calls[0]).toContain('[Velour]')
      expect(calls[1]).toContain('WARN')
      expect(calls[2]).toContain('message')
    })

    it('logs errors correctly', () => {
      logger.error('message')

      expect(spy).toHaveBeenCalled()
      const calls = spy.mock.calls[0]

      expect(calls[0]).toContain('[Velour]')
      expect(calls[1]).toContain('ERROR')
      expect(calls[2]).toContain('message')
    })

    it('logs success correctly', () => {
      logger.success('message')

      expect(spy).toHaveBeenCalled()
      const calls = spy.mock.calls[0]

      expect(calls[0]).toContain('[Velour]')
      expect(calls[1]).toContain('SUCCESS')
      expect(calls[2]).toContain('message')
    })
  })
})
