import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { AnalyticsResponseSchema, NvdiSummarySchemaResponse } from './schemas'

export const getAnalytics: FastifyPluginAsyncZod = async app => {
  app.get(
    '',
    {
      schema: {
        summary: 'Busca por todas as estatísticas',
        querystring: z.object({
          limit: z.coerce.number().optional(),
          offset: z.coerce.number().optional(),
          startDate: z.coerce.date().optional(),
          endDate: z.coerce.date().optional(),
        }),
        tags: ['Analytics'],
        operationId: 'getAnalytics',
        response: {
          200: z.array(AnalyticsResponseSchema),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit, offset, startDate, endDate } = request.query

      const analyticsController = new AnalyticsController()

      const [error, data] = await catchError(
        analyticsController.getAllAnalytics({
          limit,
          offset,
          startDate,
          endDate,
        })
      )

      if (error) {
        return reply.status(error.statusCode).send({ message: error.message })
      }

      return reply.status(StatusCodes.OK).send(data)
    }
  )
}
