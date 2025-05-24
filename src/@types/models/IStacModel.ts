import type { z } from 'zod'
import type { Feature, Stac } from '#/@types/stac/IResponse'
import type { bodySchema as StacBodySchema } from '#/routes/stac/search'
import type { CreateCicatrizProps } from '../controller/ICicatriz'

export type StacHttpInterface = z.infer<typeof StacBodySchema>

type Bands = {
  BAND_15: string
  BAND_16: string
}

type DBResponse = {
  id: string
  createdAt: Date | null
  itemId: string
  collection: string
  startDate: Date
  endDate: Date
  bbox: unknown
  geometry: unknown
  band_15: string
  band_16: string
}

export interface StacModelInterface {
  httpService: (url: string, body: CreateCicatrizProps) => Promise<Stac>
  getImageUrl: (item: Feature) => string
  getBands: (item: Feature) => Bands
  getFeature: (stac: Stac) => Feature
  imageDownload: (imageUrl: string, localPath: string) => Promise<string>
  saveImage: (
    item: Feature,
    band_15: string,
    band_16: string,
    datetime: string
  ) => Promise<DBResponse>
}
