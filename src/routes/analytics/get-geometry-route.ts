import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { GeometryResponseSchema } from './schemas'

export const getGeometryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/:scarId/geometry',
    {
      schema: {
        summary: 'Gera a geometria de uma cicatriz',
        params: z.object({
          scarId: z.string(),
        }),
        tags: ['Analytics'],
        operationId: 'getGeometry',
        response: {
          200: GeometryResponseSchema,
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
        analyticsController.generateGeometry({
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
