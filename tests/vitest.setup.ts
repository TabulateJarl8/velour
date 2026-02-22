import { config as shellcheckConfig } from 'shellcheck/build/configs/config.js'
import { spawnSync } from 'node:child_process'
import { expect } from 'vitest'

expect.extend({
  toBeValidBash(content: string) {
    const result = spawnSync(shellcheckConfig.bin, ['-s', 'bash', '-'], {
      input: content,
      encoding: 'utf-8',
    })

    if (result.status === 0) {
      return {
        message: () => 'expected script not to be valid bash',
        pass: true,
      }
    } else {
      return {
        message: () => `expected script to be valid bash:\n${result.stdout}`,
        pass: false,
      }
    }
  },
})
