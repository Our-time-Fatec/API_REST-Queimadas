import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { AllDataAnalyticsSchemaResponse } from './schemas'

export const getAllDataAnalyticsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:scarId/all',
    {
      schema: {
        summary: 'Busca os dados completos de uma cicatriz',
        params: z.object({
          scarId: z.string(),
        }),
        tags: ['Analytics'],
        operationId: 'getAllDataAnalytics',
        response: {
          200: AllDataAnalyticsSchemaResponse,
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
        analyticsController.getAllDataAnalytics({
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
