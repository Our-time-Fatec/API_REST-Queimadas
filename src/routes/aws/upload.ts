import type { MultipartFile } from '@fastify/multipart'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '#/drizzle/client'
import { uploads } from '#/drizzle/schemas/uploads'
import { StatusCodes } from '#/enums/status-code'
import { catchError } from '#/utils/catchError'
import { uploadToS3 } from '../../aws/uploadToS3'

export const uploadRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '',
    {
      schema: {
        summary: 'Upload de arquivo para S3',
        tags: ['Upload'],
        operationId: 'uploadFile',
        consumes: ['multipart/form-data'],
        response: {
          [StatusCodes.OK]: z.object({
            url: z.string().url(),
            originalFileName: z.string(),
          }),
          [StatusCodes.INTERNAL_SERVER_ERROR]: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const req = request as typeof request & {
        file: () => Promise<MultipartFile>
      }

      const data = await req.file()

      if (!data) {
        return reply.status(400).send({ message: 'Nenhum arquivo enviado' })
      }

      const chunks: Buffer[] = []
      for await (const chunk of data.file) chunks.push(chunk)

      const buffer = Buffer.concat(chunks)
      const folder = 'uploads'

      const [error, uploadResult] = await catchError(
        uploadToS3({
          fileBuffer: buffer,
          fileName: data.filename,
          mimeType: data.mimetype,
          folder,
        })
      )

      if (error) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: error.message,
        })
      }

      try {
        await db.insert(uploads).values({
          url: uploadResult.url,
          originalFileName: uploadResult.originalFileName,
        })

        return reply.status(StatusCodes.OK).send(uploadResult)
      } catch (dbError) {
        return reply.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: 'Erro ao salvar no banco de dados',
        })
      }
    }
  )
}
