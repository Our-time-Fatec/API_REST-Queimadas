import type { MultipartFile } from '@fastify/multipart'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { scarStatus } from '#/constants/scar-status'
import { CicatrizController } from '#/controllers/CicatrizController'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'

interface MultipartFileRequest {
  file: () => Promise<MultipartFile>
}

export const finalizeCicatrizRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/finalize',
    {
      schema: {
        summary: 'Finaliza o processamento de uma cicatriz',
        tags: ['Cicatriz'],
        operationId: 'finalizeCicatriz',
        consumes: ['multipart/form-data'],
        querystring: z.object({
          jobId: z.string(),
          status: z.enum(scarStatus),
        }),
        response: {
          [StatusCodes.OK]: z.object({
            message: z.string(),
          }),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const req = request as typeof request & MultipartFileRequest
      const { jobId, status } = request.query

      const data = await req.file()

      const cicatrizController = new CicatrizController()

      const [error] = await catchError(
        cicatrizController.finalizeCicatriz({ data, jobId, status })
      )

      if (error) {
        return reply.status(error.statusCode).send({
          message: error.message,
        })
      }

      return reply.status(StatusCodes.OK).send({
        message: 'Upload realizado com sucesso',
      })
    }
  )
}
