import fs from 'node:fs'
import path from 'node:path'
import type { Readable } from 'node:stream'
import axios, { type AxiosResponse } from 'axios'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import type { Stac } from '#/@types/stac/IResponse'
import { http } from '#/client/http'
import type { CustomError } from '#/errors/custom/CustomError'
import { logger } from '#/settings/logger'
import { catchError } from '#/utils/catchError'
import { getDirname } from '#/utils/path'

export const bodySchema = z.object({
  collections: z.array(z.string()),
  bbox: z.array(z.number()).length(4),
  datetime: z.string(),
  limit: z.number().optional(),
})

export const stacSearchRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/search',
    {
      schema: {
        body: bodySchema,
        summary: 'Pesquisar imagens STAC',
        tags: ['STAC'],
        operationId: 'stacSearch',
        response: {
          200: z.object({
            message: z.string(),
            imagePath: z.string(),
          }),
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { collections, bbox, datetime, limit } = request.body
      const stacUrl = 'https://data.inpe.br/bdc/stac/v1/search'

      const [fetchError, data] = await catchError(
        http<Stac>(stacUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collections,
            bbox,
            datetime,
            limit: limit || 10,
          }),
        })
      )

      if (fetchError) {
        const { statusCode, message, stack } = fetchError
        logger.error('Erro ao buscar dados STAC:', stack)
        return reply.code(statusCode).send({
          message: `Erro ao buscar dados STAC. Erro: ${message}`,
        })
      }

      logger.success(data)

      const features = data.features

      if (!features || features.length === 0) {
        logger.warn('Nenhum dado encontrado. Contexto:', data.context)
        return reply.code(404).send({
          message: 'Nenhuma imagem encontrada para os critérios especificados.',
        })
      }

      const item = features[0]

      logger.info('Item encontrado:', item)
      const assets = item.assets
      const availableAssets = Object.keys(assets)
      logger.success('Assets disponíveis:', availableAssets)

      let imageUrl = assets.thumbnail?.href || assets.visual?.href
      if (!imageUrl) {
        return reply.code(404).send({
          message: 'Nenhuma imagem com asset visual ou thumbnail disponível.',
        })
      }

      logger.info(assets)

      imageUrl = imageUrl.replace(/^\/vsicurl\//, '')
      logger.info('Baixando imagem de:', imageUrl)

      const fileName = path.basename(imageUrl)
      const __dirname = getDirname()

      const imagesDir = path.join(__dirname, '..', 'images')

      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir)
      }

      const localPath = path.join(imagesDir, fileName)
      const [axiosError, imageResponse]:
        | [CustomError, null]
        | [null, AxiosResponse<Readable>] = await catchError(
        axios.get(imageUrl, {
          responseType: 'stream',
        })
      )

      if (axiosError) {
        const { statusCode, message } = axiosError
        return reply.code(statusCode).send({
          message: `Erro ao baixar a imagem. Erro: ${message}`,
        })
      }

      const writer = fs.createWriteStream(localPath)

      const [errorStream] = await catchError(
        new Promise<void>((resolve, reject) => {
          imageResponse.data.pipe(writer)
          writer.on('finish', resolve)
          writer.on('error', reject)
        })
      )

      if (errorStream) {
        const { statusCode, message } = errorStream
        logger.error('Erro ao baixar a imagem:', errorStream)

        return reply.code(statusCode).send({
          message: `Erro ao baixar a imagem. Erro: ${message}`,
        })
      }

      // const [dbError] = await catchError(
      //   db.insert(stacImages).values({
      //     itemId: item.id,
      //     collection: item.collection,
      //     startDate: new Date(item.properties.datetime),
      //     bbox: item.bbox,
      //     geometry: item.geometry,
      //     band_15: imageUrl,
      //     band_16: localPath,
      //   })
      // )

      // if (dbError) {
      //   const { statusCode, message } = dbError
      //   return reply.code(statusCode).send({
      //     message: `Erro ao salvar a imagem no banco de dados. Erro: ${message}`,
      //   })
      // }

      return reply.send({
        message: 'Imagem baixada e salva com sucesso.',
        imagePath: localPath,
      })
    }
  )
}
