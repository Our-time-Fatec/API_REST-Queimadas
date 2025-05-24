import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CicatrizController } from '#/controllers/CicatrizController'
import { StatusCodes } from '#/enums/status-code'
import { logger } from '#/settings/logger'
import { catchError } from '#/utils/catchError'
import { cicatrizBboxResponseSchema, cicatrizSchema } from './schema/schemas'

const paramsSchema = z.object({
  id: z.string(),
})

export const searchCicatrizByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:id',
    {
      schema: {
        params: paramsSchema,
        summary: 'Pesquisar imagens de queimada por id',
        tags: ['Cicatriz'],
        operationId: 'searchCicatrizById',
        response: {
          201: cicatrizSchema,
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
        cicatrizController.getCicatrizById({
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
