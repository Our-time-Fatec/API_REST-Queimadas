import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CicatrizController } from '#/controllers/CicatrizController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { analyticsCicatrizSchema } from './schema/schemas'

const paramsSchema = z.object({
  id: z.string(),
})

export const analyticsCicatrizRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/analytics/:id',
    {
      schema: {
        params: paramsSchema,
        summary: 'Gerar analytics de cicatriz por id',
        tags: ['Cicatriz'],
        operationId: 'analyticsCicatriz',
        response: {
          200: analyticsCicatrizSchema,
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const cicatrizController = new CicatrizController()

      const [error, data] = await catchError(
        cicatrizController.getCicatrizDetails({
          id,
        })
      )

      if (error) {
        return reply.status(error.statusCode).send({
          message: error.message,
        })
      }

      return reply.status(StatusCodes.OK).send(data)
    }
  )
}
