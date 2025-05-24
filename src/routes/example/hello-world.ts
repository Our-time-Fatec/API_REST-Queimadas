import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { ExampleController } from '#/controllers/ExampleController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'

export const helloWorldRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/hello-world',
    {
      schema: {
        summary: 'Example route',
        tags: ['Example'],
        operationId: 'helloWorld',
        // body: z.object({}),
        // params: z.object({}),
        // body: z.object({
        //   name: z.string(),
        // }),

        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
          }),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      // Testem essa função de diferentes formas mudando de false para true[]

      // const { name } = request.body
      const exampleController = new ExampleController(false)

      const [error, data] = await catchError(exampleController.getHelloWorld())

      if (error) {
        return reply.status(error.statusCode).send({
          message: error.message,
        })
      }

      return reply.status(StatusCodes.OK).send({
        message: data,
      })
    }
  )
}
