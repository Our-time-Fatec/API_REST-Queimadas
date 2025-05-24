import type { AreaStats, NdviStats, Summary } from '#/schemas/iaSchema'

export interface SaveAnalyticsProps {
  bbox_real: number[]
  ndvi_stats: NdviStats
  area_stats: AreaStats
}

export interface SaveBBoxAnalyticsProps {
  bbox_real: number[]
}

export interface SaveNvdiStatsAnalyticsProps {
  ndvi_stats: NdviStats
  analyticsId: number
}

export interface SaveAreaStatsAnalyticsProps {
  area_stats: AreaStats
  analyticsId: number
}

export interface SaveAreaSummaryAnalyticsProps {
  summary: Summary
  analyticsId: number
}

export interface SaveAnalyticsIdProps {
  analyticsId: number
  jobId: string
}
