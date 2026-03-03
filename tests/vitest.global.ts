import { shellcheck } from 'shellcheck'
import which from 'which'

/** Install shellcheck before any tests run */
export default async function setup() {
  const path = await which('shellcheck', { nothrow: true })

  // download shellcheck if host system doesnt have it installed
  if (!path) await shellcheck({ args: ['--version'] })
}
