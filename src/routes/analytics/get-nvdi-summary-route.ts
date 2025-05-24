import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { NvdiSummarySchemaResponse } from './schemas'

export const getNvdiSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:scarId/nvdi-summary',
    {
      schema: {
        summary: 'Busca os dados do status do nvdi de uma cicatriz',
        params: z.object({
          scarId: z.string(),
        }),
        tags: ['Analytics'],
        operationId: 'getNvdiSummary',
        response: {
          200: NvdiSummarySchemaResponse,
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
        analyticsController.getNvdiSummaryStats({
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
