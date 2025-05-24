import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { NVDIResultSchema } from '#/schemas/iaSchema'
import { catchError } from '#/utils/catchError'

export const saveAnalyticsRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/save-analytics',
    {
      schema: {
        summary: 'Salva os dados de analytics de uma cicatriz',
        body: NVDIResultSchema,
        querystring: z.object({
          jobId: z.string(),
        }),
        tags: ['Analytics'],
        operationId: 'saveAnalytics',
        description: 'Salva os dados de analytics de uma cicatriz',
        response: {
          200: z.object({
            message: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { bbox_real, area_stats, ndvi_stats } = request.body
      const { jobId } = request.query

      const analyticsController = new AnalyticsController()

      const [error] = await catchError(
        analyticsController.saveAnalytics({
          area_stats,
          bbox_real,
          ndvi_stats,
          jobId,
        })
      )

      if (error) {
        return reply.status(error.statusCode).send({ message: error.message })
      }

      return reply.status(StatusCodes.OK).send({ message: 'Analytics salva' })
    }
  )
}
