const Color = {
  grey: '\x1b[1;30m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  brightBlue: '\x1b[34;1m',
  green: '\x1b[32m',
  orange: '\x1b[33m',
  red: '\x1b[31m',
}

function prefix(): string {
  const now = new Date().toISOString()
  return `${Color.grey}${now}${Color.cyan} [Velour]${Color.reset}`
}

export const logger = {
  info(msg: string, ...args: unknown[]) {
    console.log(prefix(), `${Color.brightBlue}INFO${Color.reset}`, msg, ...args)
  },
  success(msg: string, ...args: unknown[]) {
    console.log(prefix(), `${Color.green}SUCCESS${Color.reset}`, msg, ...args)
  },
  warning(msg: string, ...args: unknown[]) {
    console.log(prefix(), `${Color.orange}WARN${Color.reset}`, msg, ...args)
  },
  error(msg: string, ...args: unknown[]) {
    console.log(prefix(), `${Color.red}ERROR${Color.reset}`, msg, ...args)
  },
}
