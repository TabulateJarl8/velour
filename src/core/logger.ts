type LogLevel = 'info' | 'success' | 'warning' | 'error'

const IsBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

const ANSI = {
  grey: '\x1b[1;30m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  brightBlue: '\x1b[34;1m',
  green: '\x1b[32m',
  orange: '\x1b[33m',
  red: '\x1b[31m',
} as const

const CSS = {
  grey: 'color: #808080;',
  cyan: 'color: #16A084;',
  reset: '',
  brightBlue: 'color: #3DAEE9; font-weight: bold;',
  green: 'color: #11D116;  font-weight: bold;',
  orange: 'color: #F67400;  font-weight: bold;',
  red: 'color: #ED1515;  font-weight: bold;',
} as const

const LogLevelMap: Record<LogLevel, { label: string; color: keyof typeof ANSI }> = {
  info: { label: 'INFO', color: 'brightBlue' },
  success: { label: 'SUCCESS', color: 'green' },
  warning: { label: 'WARN', color: 'orange' },
  error: { label: 'ERROR', color: 'red' },
}

function log(level: LogLevel, msg: string, args: unknown[]) {
  const now = new Date().toISOString()
  const config = LogLevelMap[level]

  if (IsBrowser) {
    const format = `%c${now} %c[Velour] %c${config.label}`
    console.log(format, CSS.grey, CSS.cyan, CSS[config.color], msg, ...args)
  } else {
    const prefix = `${ANSI.grey}${now}${ANSI.cyan} [Velour]${ANSI.reset}`
    const tag = `${ANSI[config.color]}${config.label}${ANSI.reset}`
    console.log(prefix, tag, msg, ...args)
  }
}

export const logger = {
  info: (msg: string, ...args: unknown[]) => log('info', msg, args),
  success: (msg: string, ...args: unknown[]) => log('success', msg, args),
  warning: (msg: string, ...args: unknown[]) => log('warning', msg, args),
  error: (msg: string, ...args: unknown[]) => log('error', msg, args),
}
