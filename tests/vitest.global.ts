import { shellcheck } from 'shellcheck'

/** Install shellcheck before any tests run */
export default async function setup() {
  await shellcheck({ args: ['--version'] })
}
