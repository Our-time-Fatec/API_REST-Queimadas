// Essa é uma classe base para erros personalizados, que estende a classe Error. Para facilitar a não repetição de
// erros específicos, crie uma classe que estenda essa e personalize o erro. Exemplo:

/* 
export class ErrorTransaction extends CustomError {
  constructor(message: string, statusCode = 400, code = 'ERROR_TRANSACTION') {
    super(message, statusCode, code)
  }
}

export class TransactionNotFoundError extends ErrorTransaction {
  constructor() {
    super('Transação não encontrada', 404, 'TRANSACTION_NOT_FOUND')
  }
}
*/

export class CustomError extends Error {
  statusCode: number
  code: string

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message)
    this.name = new.target.name
    this.statusCode = statusCode
    this.code = code

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}
