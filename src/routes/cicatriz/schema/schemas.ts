import z from 'zod'
import { scarStatus } from '#/constants/scar-status'

export const geometrySchema = z.object({
  type: z.string(),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
})

export const cicatrizSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  stacId: z.string().nullable(),
  uploadId: z.number().nullable(),
  createdAt: z.date().nullable(),
  status: z.enum(scarStatus),
  url: z.string().url().nullable(),
  collection: z.string().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  bbox: z.preprocess(val => {
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val)
        return parsed
      } catch {
        return val
      }
    }
    return val
  }, z.array(z.number())),
  geometry: z.unknown().transform(val => {
    return geometrySchema.parse(val)
  }),
})

const cicatrizesSchema = z.array(cicatrizSchema)

const allCicatriz = z.array(
  cicatrizSchema.pick({
    id: true,
    jobId: true,
    stacId: true,
    uploadId: true,
    createdAt: true,
    status: true,
    url: true,
  })
)

export const allCicatrizSchema = z.object({
  data: allCicatriz,
  count: z.number(),
})

export const cicatrizBboxResponseSchema = z.object({
  data: cicatrizesSchema,
  count: z.number(),
})

const summary = z.object({
  type: z.enum(['Polygon', 'MultiPolygon']),
  ringCount: z.number(),
  vertexCount: z.number(),
})

export const analyticsCicatrizSchema = cicatrizSchema.extend({
  area: z.string(),
  perimeter: z.string(),
  centroid: z.tuple([z.number(), z.number()]),
  geometry: summary,
})
