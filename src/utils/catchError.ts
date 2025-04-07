import { CustomError } from '#/errors/custom/CustomError'

type TryCatchResult<T, E = CustomError> =
  | [error: E, result: null]
  | [error: null, result: T]

export async function catchError<T>(
  promise: Promise<T>,
  customError?: CustomError
): Promise<TryCatchResult<T>> {
  try {
    const result = await promise
    return [null, result]
  } catch (err) {
    const error =
      err instanceof CustomError
        ? err
        : customError
          ? Object.assign(customError, { message: String(err) })
          : new CustomError(String(err))

    return [error, null]
  }
}
