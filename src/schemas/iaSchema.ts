import { z } from 'zod'

export const HistogramSchema = z.object({
  range: z.array(z.number()).length(2), // assumindo que "range" é sempre um par [min, max]
  count: z.number(),
})

export const NdviStatsSchema = z.object({
  min: z.number(),
  max: z.number(),
  mean: z.number(),
  std: z.number(),
  pct_acima_0_5: z.number(),
  histogram: z.array(HistogramSchema),
})

export const PorClasseSchema = z.object({
  pixels: z.number(),
  area_m2: z.number(),
  area_ha: z.number(),
  area_km2: z.number(),
})

export const SummarySchema = z.object({
  total_area_km2: z.number(),
  burned_area_km2: z.number(),
  burned_percent: z.number(),
})

export const AreaStatsSchema = z.object({
  total_area_m2: z.number(),
  total_area_ha: z.number(),
  por_classe: z.record(PorClasseSchema),
  summary: SummarySchema,
})

export const NVDIResultSchema = z.object({
  bbox_real: z.array(z.number()),
  ndvi_stats: NdviStatsSchema,
  area_stats: AreaStatsSchema,
})

export type NVDIResult = z.infer<typeof NVDIResultSchema>
export type NdviStats = z.infer<typeof NdviStatsSchema>
export type AreaStats = z.infer<typeof AreaStatsSchema>
export type Summary = z.infer<typeof SummarySchema>
export type PorClasse = z.infer<typeof PorClasseSchema>
