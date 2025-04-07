import { CustomError } from '#/errors/custom/CustomError'

export class ExampleController {
  constructor(private readonly error: boolean) {}
  async getHelloWorld() {
    if (this.error) {
      throw new CustomError('Erro de exemplo', 500, 'EXAMPLE_ERROR')
    }
    return 'Hello, world!'
  }
}
