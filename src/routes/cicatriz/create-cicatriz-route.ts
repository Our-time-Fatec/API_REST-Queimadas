import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { CicatrizController } from '#/controllers/CicatrizController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'

export const bodySchema = z.object({
  collections: z.array(z.string()),
  bbox: z.array(z.number()).length(4),
  datetime: z.string(),
  limit: z.number().optional(),
  ignore_existing: z.boolean().optional(),
})

export const createCicatrizRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create',
    {
      schema: {
        body: bodySchema,
        summary: 'Criar processamento de cicatriz',
        tags: ['Cicatriz'],
        operationId: 'stacSearch',
        response: {
          200: z.object({
            jobId: z.string(),
            status: z.string(),
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const {
        collections,
        bbox,
        datetime,
        limit,
        ignore_existing,
        token: JWT,
      } = request.body as {
        token: string
      } & typeof request.body

      if (!JWT) {
        return reply.status(StatusCodes.UNAUTHORIZED).send({
          message: 'JWT não fornecido',
        })
      }

      const cicatrizController = new CicatrizController()

      const [error, data] = await catchError(
        cicatrizController.createCicatriz({
          collections,
          bbox,
          datetime,
          limit,
          JWT,
          ignore_existing,
        })
      )

      if (error) {
        return reply.status(error.statusCode).send({
          message: error.message,
        })
      }

      return reply.status(StatusCodes.CREATED).send(data)
    }
  )
}
