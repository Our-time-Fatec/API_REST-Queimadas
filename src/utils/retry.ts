import { CustomError } from '#/errors/custom/CustomError'
import { type TryCatchResult, catchError } from './catchError'

type RetryOptions = {
  retries?: number
  delay?: number // tempo inicial de espera (ms)
  backoff?: number // multiplicador de backoff (ex: 2 = exponencial)
  customError?: CustomError
}

export async function retryWithCatch<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<TryCatchResult<T>> {
  const { retries = 3, delay = 1000, backoff = 1, customError } = options

  let attempt = 0
  let currentDelay = delay

  while (attempt < retries) {
    const [err, result] = await catchError(fn(), customError)

    if (!err) {
      return [null, result]
    }

    attempt++
    if (attempt >= retries) {
      return [err, null]
    }

    await new Promise(res => setTimeout(res, currentDelay))
    currentDelay *= backoff
  }

  return [new CustomError('Unexpected retry failure'), null]
}
