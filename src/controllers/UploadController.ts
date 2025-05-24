import type { MultipartFile } from '@fastify/multipart'
import { uploadToS3 } from '#/aws/uploadToS3'
import { db } from '#/drizzle/client'
import { uploads } from '#/drizzle/schemas/uploads'
import { StatusCodes } from '#/enums/status-code'
import { CustomError } from '#/errors/custom/CustomError'
import { retryWithCatch } from '#/utils/retry'

export class UploadController {
  async processUpload(data: MultipartFile | undefined) {
    if (!data) {
      throw new CustomError('Nenhum arquivo enviado', 400, 'FILE_NOT_FOUND')
    }

    const chunks: Buffer[] = []
    for await (const chunk of data.file) chunks.push(chunk)

    const buffer = Buffer.concat(chunks)
    const folder = 'uploads'

    const [uploadError, uploadResult] = await retryWithCatch(
      () =>
        uploadToS3({
          fileBuffer: buffer,
          fileName: data.filename,
          mimeType: data.mimetype,
          folder,
        }),
      { delay: 5000, backoff: 2 }
    )

    if (uploadError) {
      throw new CustomError(
        'Erro ao fazer upload do arquivo',
        StatusCodes.SERVICE_UNAVAILABLE,
        'UPLOAD_ERROR'
      )
    }

    const [dbError, dbData] = await retryWithCatch(() =>
      db
        .insert(uploads)
        .values({
          url: uploadResult.url,
          originalFileName: uploadResult.originalFileName,
        })
        .returning()
    )

    if (dbError) {
      throw new CustomError(
        'Erro ao salvar imagem no banco de dados',
        StatusCodes.SERVICE_UNAVAILABLE,
        'DB_ERROR'
      )
    }

    return { ...uploadResult, id: dbData[0].id }
  }
}

export const uploadController = new UploadController()
