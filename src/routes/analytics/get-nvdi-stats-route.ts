import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { NvdiStatsSchemaResponse } from './schemas'

export const getNvdiStatsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:scarId/nvdi-stats',
    {
      schema: {
        summary: 'Busca os dados do status do nvdi completo de uma cicatriz',
        params: z.object({
          scarId: z.string(),
        }),
        tags: ['Analytics'],
        operationId: 'getNvdiStats',
        response: {
          200: NvdiStatsSchemaResponse,
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { scarId } = request.params

      const analyticsController = new AnalyticsController()

      const [error, data] = await catchError(
        analyticsController.getNvdiStats({
          scarId,
        })
      )

      if (error) {
        return reply.status(error.statusCode).send({ message: error.message })
      }

      return reply.status(StatusCodes.OK).send(data)
    }
  )
}
