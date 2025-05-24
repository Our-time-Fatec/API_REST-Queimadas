import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { AverageSchema, NvdiSummarySchemaResponse } from './schemas'

export const getHistogramAverageHistoryRoute: FastifyPluginAsyncZod =
  async app => {
    app.get(
      '/histogram-average',
      {
        schema: {
          summary: 'Busca os dados do histograma médio de uma cicatriz',
          tags: ['Analytics'],
          operationId: 'getHistogramAverageHistory',
          response: {
            200: AverageSchema,
            400: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        const analyticsController = new AnalyticsController()

        const [error, data] = await catchError(
          analyticsController.getHistogramsAverage()
        )

        if (error) {
          return reply.status(error.statusCode).send({ message: error.message })
        }

        return reply.status(StatusCodes.OK).send(data)
      }
    )
  }
