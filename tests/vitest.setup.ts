import { config as shellcheckConfig } from 'shellcheck/build/configs/config.js'
import { spawnSync } from 'node:child_process'
import { expect } from 'vitest'
import which from 'which'

let shellcheckPath: string | null = null

const getShellcheckPath = () => {
  if (shellcheckPath) return shellcheckPath

  const path = which.sync('shellcheck', { nothrow: true })
  if (path) {
    shellcheckPath = path
    return shellcheckPath
  }

  // host system doesnt have shellcheck installed, use the locally downloaded one
  shellcheckPath = shellcheckConfig.bin
  return shellcheckPath
}

expect.extend({
  toBeValidBash(content: string) {
    const shellcheck = getShellcheckPath()
    const result = spawnSync(shellcheck, ['-s', 'bash', '-'], {
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
