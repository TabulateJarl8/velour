import 'vitest'

interface CustomMatchers<R = unknown> {
  toBeValidBash: () => R
}

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
  interface Matchers<T = any> extends CustomMatchers<T> {}
}
