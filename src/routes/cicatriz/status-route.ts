import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { scarStatus } from '#/constants/scar-status'
import { CicatrizController } from '#/controllers/CicatrizController'
import { StatusCodes } from '#/enums/status-code'
import { logger } from '#/settings/logger'
import { catchError } from '#/utils/catchError'

export const statusCicatrizRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/check/:jobId',
    {
      schema: {
        summary: 'Checa o status do processamento de uma cicatriz',
        params: z.object({
          jobId: z.string(),
        }),
        tags: ['Cicatriz'],
        operationId: 'scarCheck',
        response: {
          200: z.object({
            status: z.enum(scarStatus),
            jobId: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { jobId } = request.params

      const cicatrizController = new CicatrizController()

      const [error, data] = await catchError(
        cicatrizController.getStatusCicatriz({ jobId })
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
