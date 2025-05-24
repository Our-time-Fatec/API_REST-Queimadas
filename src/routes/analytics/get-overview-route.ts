import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import {
  AverageSchema,
  NvdiSummarySchemaResponse,
  OverviewSchema,
} from './schemas'

export const getStatsOverviewRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/overview',
    {
      schema: {
        summary: 'Busca a média dos dados de analytics salvos',
        tags: ['Analytics'],
        operationId: 'getStatsOverview',
        response: {
          200: OverviewSchema,
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const analyticsController = new AnalyticsController()

      const [error, data] = await catchError(
        analyticsController.getStatsOverview()
      )

      if (error) {
        return reply.status(error.statusCode).send({ message: error.message })
      }

      return reply.status(StatusCodes.OK).send(data)
    }
  )
}
