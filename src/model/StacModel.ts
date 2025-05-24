import fs from 'node:fs'
import type { Readable } from 'node:stream'
import axios, { type AxiosResponse } from 'axios'
import type { CreateCicatrizProps } from '#/@types/controller/ICicatriz'
import type {
  StacHttpInterface,
  StacModelInterface,
} from '#/@types/models/IStacModel'
import type { Feature, Stac } from '#/@types/stac/IResponse'
import { http } from '#/client/http'
import { db } from '#/drizzle/client'
import { stacImages } from '#/drizzle/schemas/stac'
import { CustomError } from '#/errors/custom/CustomError'
import { UtilClass } from '#/utils/UtilClass'
import { catchError } from '#/utils/catchError'

export class StacModel extends UtilClass implements StacModelInterface {
  public async httpService(url: string, body: StacHttpInterface) {
    const { collections, bbox, datetime, limit } = body

    const response = await http<Stac>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collections,
        bbox,
        datetime,
        limit: limit || 10,
      }),
    })

    return response
  }

  getFeature(stac: Stac) {
    return stac.features[0]
  }

  getImageUrl(item: Feature) {
    const assets = item.assets
    let imageUrl = assets.thumbnail?.href || assets.visual?.href

    if (!imageUrl) {
      throw new CustomError(
        'Nenhuma imagem com asset visual ou thumbnail disponível.',
        404,
        'NO_IMAGE'
      )
    }

    imageUrl = imageUrl.replace(/^\/vsicurl\//, '')

    return imageUrl
  }

  getBands(item: Feature) {
    const assets = item.assets
    const BAND15_URL = assets.BAND15?.href
    const BAND16_URL = assets.BAND16?.href

    if (!BAND15_URL || !BAND16_URL) {
      throw new CustomError(
        'Nenhuma imagem com asset BAND15 ou BAND16 disponível.',
        404,
        'NO_BAND'
      )
    }

    return {
      BAND_15: BAND15_URL,
      BAND_16: BAND16_URL,
    }
  }

  async imageDownload(imageUrl: string, localPath: string) {
    const [axiosError, imageResponse]:
      | [CustomError, null]
      | [null, AxiosResponse<Readable>] = await catchError(
      axios.get(imageUrl, {
        responseType: 'stream',
      })
    )

    if (axiosError) {
      const { statusCode, message } = axiosError
      throw new CustomError(
        `Erro ao baixar a imagem. Erro: ${message}`,
        statusCode,
        'ERROR_DOWNLOADING_IMAGE'
      )
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
      throw new CustomError(
        `Erro ao baixar a imagem. Erro: ${message}`,
        statusCode,
        'ERROR_DOWNLOADING_IMAGE'
      )
    }

    return localPath
  }

  public async saveImage(
    item: Feature,
    band_15: string,
    band_16: string,
    datetime: string
  ) {
    const { startDate, endDate } = this.separarData(datetime)
    const [dbError, dbData] = await catchError(
      db
        .insert(stacImages)
        .values({
          itemId: item.id,
          collection: item.collection,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          bbox: item.bbox,
          geometry: item.geometry,
          band_15,
          band_16,
        })
        .returning()
    )

    if (dbError) {
      const { message } = dbError
      throw new CustomError(
        `Erro ao salvar a imagem no banco de dados. Erro: ${message}`,
        503,
        'ERROR_SAVING_IMAGE'
      )
    }

    const imageData = dbData[0]

    return imageData
  }
}

export const stacModel = new StacModel()
