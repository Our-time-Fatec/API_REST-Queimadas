import pc from 'picocolors'
import { env } from './env'

type LogParams = [message?: unknown, ...params: unknown[]]

function log(...params: LogParams) {
  return console.log(...params)
}

function success(...params: LogParams) {
  return log(pc.green('✓'), ...params)
}
function warn(...params: LogParams) {
  return console.warn(pc.yellow('▲'), ...params)
}

function info(...params: LogParams) {
  return console.info(pc.blue('ℹ'), ...params)
}

function error(...params: LogParams) {
  return console.error(pc.red('✖︎'), ...params)
}

function debug(...params: LogParams) {
  if (env.DEBUG_LEVEL) {
    return console.debug(pc.magenta('🐞'), ...params)
  }
}

function table(data: Record<string, unknown>[] | Record<string, unknown>) {
  return console.table(data)
}

function task(...params: LogParams) {
  return log(pc.cyan('🛠'), ...params)
}

function pending(...params: LogParams) {
  return log(pc.gray('⏳'), ...params)
}

function done(...params: LogParams) {
  return log(pc.greenBright('✅'), ...params)
}

export const logger = {
  log,
  success,
  warn,
  info,
  debug,
  error,
  table,
  task,
  pending,
  done,
}
