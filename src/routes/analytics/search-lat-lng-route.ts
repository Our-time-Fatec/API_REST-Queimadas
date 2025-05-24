import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { AnalyticsController } from '#/controllers/AnalyticsController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { LatLngSchema, NvdiSummarySchemaResponse } from './schemas'

export const searchLatLngRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/search-lat-lng',
    {
      schema: {
        summary: 'Busca por cicatrizes em uma área geográfica',
        querystring: z.object({
          lat: z.coerce.number(),
          lng: z.coerce.number(),
          page: z.coerce.number().optional(),
        }),
        tags: ['Analytics'],
        operationId: 'searchLatLng',
        response: {
          200: z.array(LatLngSchema),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { lat, lng, page = 1 } = request.query

      const analyticsController = new AnalyticsController()

      const [error, data] = await catchError(
        analyticsController.searchLatLng({
          lat,
          lng,
          page,
        })
      )

      if (error) {
        return reply.status(error.statusCode).send({ message: error.message })
      }

      return reply.status(StatusCodes.OK).send(data)
    }
  )
}
