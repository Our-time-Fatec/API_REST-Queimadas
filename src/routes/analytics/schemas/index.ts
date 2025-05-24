import z from 'zod'
import { NdviStatsSchema, PorClasseSchema } from '#/schemas/iaSchema'

const PorClasseResponseSchema = PorClasseSchema.extend({
  label: z.string(),
  classe: z.string(),
})

export const AreaStatsSchemaResponse = z.object({
  scarId: z.string(),
  analyticsId: z.number().nullable(),
  totalAreaM2: z.number(),
  totalAreaHa: z.number(),
  areaStatsId: z.number(),
  classes: z.array(PorClasseResponseSchema),
})

export const NvdiStatsSchemaResponse = NdviStatsSchema.extend({
  scarId: z.string(),
  analyticsId: z.number().nullable(),
  nvdiId: z.number(),
})

export const NvdiSummarySchemaResponse = NvdiStatsSchemaResponse.omit({
  histogram: true,
  pct_acima_0_5: true,
}).extend({
  pctAcima05: z.number(),
})

export const AreaSummarySchemaResponse = z.object({
  scarId: z.string(),
  analyticsId: z.number().nullable(),
  summaryId: z.number(),
  totalAreaKm2: z.number(),
  burnedAreaKm2: z.number(),
  burnedPercent: z.number(),
})

export const AllDataAnalyticsSchemaResponse = z.object({
  id: z.string(),
  analyticsId: z.number(),
  stacId: z.string(),
  uploadId: z.number().nullable(),
  areaStats: z.object({
    id: z.number(),
    analyticsId: z.number(),
    total_area_m2: z.number(),
    total_area_ha: z.number(),
    por_classe: z.unknown(),
  }),
  ndviStats: z.object({
    id: z.number(),
    analyticsId: z.number(),
    min: z.number(),
    max: z.number(),
    mean: z.number(),
    std: z.number(),
    pct_acima_0_5: z.number(),
    histogram: z.unknown(),
  }),
  areaSummary: z.object({
    id: z.number(),
    analyticsId: z.number(),
    total_area_km2: z.number(),
    burned_area_km2: z.number(),
    burned_percent: z.number(),
  }),
})

export const GeometryResponseSchema = z.object({
  areaKm2: z.number(),
  perimeterKm: z.number(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  centroid: z.tuple([z.number(), z.number()]),
  ringCount: z.number(),
  type: z.enum(['Polygon', 'MultiPolygon']),
  vertexCount: z.number(),
})

export const AnalyticsResponseSchema = z.object({
  id: z.number(),
  scarId: z.string(),
  bboxReal: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  createdAt: z.date().nullable(),
})

export const AnalyticsResponseSchemaArray = z.array(AnalyticsResponseSchema)

export const LatLngSchema = z.object({
  id: z.number(),
  bbox_real: z.array(z.number()),
  created_at: z.date().nullable(),
})

export const AverageSchema = z.object({
  averages: z.array(
    z.object({
      range: z.tuple([z.number(), z.number()]),
      averageCount: z.number(),
    })
  ),
})

export const OverviewSchema = z.object({
  totalAreas: z.number(),
  totalAreaKm2: z.string().nullable(),
  totalBurnedKm2: z.string().nullable(),
  avgNdvi: z.string().nullable(),
  minDate: z.date().nullable(),
  maxDate: z.date().nullable(),
})
