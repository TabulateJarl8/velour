import { Blob } from 'node:buffer'
import { spawnSync } from 'node:child_process'
import { CompressionStream, DecompressionStream } from 'node:stream/web'

import { config as shellcheckConfig } from 'shellcheck/build/configs/config.js'
import { expect, vi } from 'vitest'

vi.stubGlobal('Blob', Blob)
vi.stubGlobal('CompressionStream', CompressionStream)
vi.stubGlobal('DecompressionStream', DecompressionStream)

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
