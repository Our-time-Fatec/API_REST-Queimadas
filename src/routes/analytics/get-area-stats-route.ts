import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { AreaStatsSchemaResponse } from './schemas'

export const getAreaStatsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:scarId/area-stats',
    {
      schema: {
        summary: 'Busca os dados do status da área de uma cicatriz',
        params: z.object({
          scarId: z.string(),
        }),
        tags: ['Analytics'],
        operationId: 'getAreaStats',
        response: {
          200: AreaStatsSchemaResponse,
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
        analyticsController.getAreaStats({
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
