import { eq } from 'drizzle-orm'
import type {
  SaveAnalyticsIdProps,
  SaveAnalyticsProps,
  SaveAreaStatsAnalyticsProps,
  SaveAreaSummaryAnalyticsProps,
  SaveBBoxAnalyticsProps,
  SaveNvdiStatsAnalyticsProps,
} from '#/@types/models/IAnalyticsModel'
import { db } from '#/drizzle/client'
import {
  analytics,
  areaStats,
  areaSummary,
  ndviStats,
} from '#/drizzle/schemas/analytics'
import { scarImage } from '#/drizzle/schemas/scar'
import { CustomError } from '#/errors/custom/CustomError'
import { UtilClass } from '#/utils/UtilClass'
import { catchError } from '#/utils/catchError'
import { retryWithCatch } from '#/utils/retry'

export class AnalyticsModel extends UtilClass {
  async saveBboxAnalytics({ bbox_real }: SaveBBoxAnalyticsProps) {
    const [error, data] = await retryWithCatch(() =>
      db.insert(analytics).values({ bbox_real }).returning()
    )

    if (error) {
      throw new CustomError(
        'Erro ao salvar os dados de analytics',

        503,
        'ERROR_SAVING_ANALYTICS'
      )
    }

    return data[0].id
  }

  async saveNvdiStatsAnalytics({
    ndvi_stats,
    analyticsId,
  }: SaveNvdiStatsAnalyticsProps) {
    const { min, max, mean, std, histogram, pct_acima_0_5 } = ndvi_stats

    const [error, data] = await retryWithCatch(() =>
      db
        .insert(ndviStats)
        .values({
          analyticsId,
          min,
          max,
          mean,
          histogram,
          pct_acima_0_5,
          std,
        })
        .returning()
    )

    if (error) {
      throw new CustomError(
        'Erro ao salvar os dados de NVDI de analytics',
        503,
        'ERROR_SAVING_NVDI_ANALYTICS'
      )
    }

    return data[0]
  }

  async saveAreaStatsAnalytics({
    analyticsId,
    area_stats,
  }: SaveAreaStatsAnalyticsProps) {
    const { total_area_m2, total_area_ha, por_classe } = area_stats

    const [error, data] = await retryWithCatch(() =>
      db
        .insert(areaStats)
        .values({
          analyticsId,
          total_area_m2,
          total_area_ha,
          por_classe,
        })
        .returning()
    )

    if (error) {
      throw new CustomError(
        'Erro ao salvar os dados de status de área de analytics',
        503,
        'ERROR_SAVING_AREA_STATS_ANALYTICS'
      )
    }

    return data[0]
  }

  async saveAreaSummaryAnalytics({
    analyticsId,
    summary,
  }: SaveAreaSummaryAnalyticsProps) {
    const { total_area_km2, burned_area_km2, burned_percent } = summary

    const [error, data] = await retryWithCatch(() =>
      db
        .insert(areaSummary)
        .values({
          analyticsId,
          total_area_km2,
          burned_area_km2,
          burned_percent,
        })
        .returning()
    )

    if (error) {
      throw new CustomError(
        'Erro ao salvar os dados de resumo de área de analytics',
        503,
        'ERROR_SAVING_AREA_SUMMARY_ANALYTICS'
      )
    }

    return data[0]
  }

  async saveAnalytics({
    area_stats,
    bbox_real,
    ndvi_stats,
  }: SaveAnalyticsProps) {
    const [bboxError, analyticsId] = await catchError(
      this.saveBboxAnalytics({ bbox_real })
    )

    if (bboxError) {
      throw new CustomError(
        bboxError.message,
        bboxError.statusCode,
        bboxError.code
      )
    }

    const [nvdiError] = await catchError(
      this.saveNvdiStatsAnalytics({ ndvi_stats, analyticsId })
    )

    if (nvdiError) {
      throw new CustomError(
        nvdiError.message,
        nvdiError.statusCode,
        nvdiError.code
      )
    }

    const [areaError] = await catchError(
      this.saveAreaStatsAnalytics({ area_stats, analyticsId })
    )
    if (areaError) {
      throw new CustomError(
        areaError.message,
        areaError.statusCode,
        areaError.code
      )
    }

    const [summaryError] = await catchError(
      this.saveAreaSummaryAnalytics({
        summary: area_stats.summary,
        analyticsId,
      })
    )

    if (summaryError) {
      throw new CustomError(
        summaryError.message,
        summaryError.statusCode,
        summaryError.code
      )
    }

    return {
      id: analyticsId,
      areaStats: area_stats,
      nvdiStats: ndvi_stats,
      areaSummary: area_stats.summary,
    }
  }

  async updateScar({ analyticsId, jobId }: SaveAnalyticsIdProps) {
    const [error, data] = await retryWithCatch(() =>
      db
        .update(scarImage)
        .set({ analyticsId })
        .where(eq(scarImage.jobId, jobId))
        .returning()
    )

    if (error) {
      throw new CustomError(
        'Erro ao salvar os dados de analytics em referencia',
        503,
        'ERROR_SAVING_ANALYTICS_SCAR'
      )
    }

    if (data.length === 0) {
      throw new CustomError(
        'Não foi possível encontrar a cicatriz com o jobId informado',
        404,
        'ERROR_NOT_FOUND_SCAR'
      )
    }

    return data[0].id
  }
}
