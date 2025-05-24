import { and, avg, count, eq, max, min, sql, sum } from 'drizzle-orm'
import z from 'zod'
import type {
  GetAllAnalyticsProps,
  GetAreaStatsProps,
  SaveAnalyticsControllerProps,
  SearchLatLngProps,
} from '#/@types/controller/IAnalyticsController'
import { CLASSE_LABELS } from '#/constants/areas'
import { db } from '#/drizzle/client'
import {
  analytics,
  areaStats,
  areaSummary,
  ndviStats,
} from '#/drizzle/schemas/analytics'
import { scarImage } from '#/drizzle/schemas/scar'
import { stacImages } from '#/drizzle/schemas/stac'
import { CustomError } from '#/errors/custom/CustomError'
import { AnalyticsModel } from '#/model/AnalyticsModel'
import {
  AnalyticsResponseSchema,
  AnalyticsResponseSchemaArray,
  LatLngSchema,
} from '#/routes/analytics/schemas'
import {
  HistogramSchema,
  NdviStatsSchema,
  PorClasseSchema,
} from '#/schemas/iaSchema'
import { logger } from '#/settings/logger'
import { UtilClass } from '#/utils/UtilClass'
import { catchError } from '#/utils/catchError'
import { retryWithCatch } from '#/utils/retry'

export class AnalyticsController extends UtilClass {
  private analyticsModel: AnalyticsModel

  constructor() {
    super()
    this.analyticsModel = new AnalyticsModel()
  }

  async saveAnalytics({
    area_stats,
    bbox_real,
    ndvi_stats,
    jobId,
  }: SaveAnalyticsControllerProps) {
    const [analyticsError, data] = await catchError(
      this.analyticsModel.saveAnalytics({ area_stats, bbox_real, ndvi_stats })
    )

    if (analyticsError) {
      throw new CustomError(
        analyticsError.message,
        analyticsError.statusCode,
        analyticsError.code
      )
    }

    const analyticsId = data.id

    const [err] = await retryWithCatch(() =>
      this.analyticsModel.updateScar({ analyticsId, jobId })
    )

    if (err) {
      throw new CustomError(err.message, err.statusCode, err.code)
    }

    return {
      id: analyticsId,
      bbox_real,
      area_stats,
      ndvi_stats,
    }
  }

  async getAreaStats({ scarId }: GetAreaStatsProps) {
    const query = db
      .select({
        scarId: scarImage.id,
        analyticsId: analytics.id,
        areaStatsId: areaStats.id,
        totalAreaM2: areaStats.total_area_m2,
        totalAreaHa: areaStats.total_area_ha,
        porClasse: areaStats.por_classe,
      })
      .from(scarImage)
      .leftJoin(analytics, eq(analytics.id, scarImage.analyticsId))
      .innerJoin(areaStats, eq(areaStats.analyticsId, analytics.id))
      .where(eq(scarImage.id, scarId))

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError(
        'Error ao buscar estatísticas de área',
        503,
        'ERROR_GET_AREA_STATS'
      )
    }

    const { porClasse, ...rest } = data[0]

    const parsedPorClasse = z.record(PorClasseSchema).parse(porClasse)

    const classes = Object.entries(parsedPorClasse).map(
      ([classe, valores]) => ({
        classe,
        label: CLASSE_LABELS[classe] ?? 'Desconhecido',
        ...valores,
      })
    )

    return {
      classes,
      ...rest,
    }
  }

  async getNvdiStats({ scarId }: GetAreaStatsProps) {
    const query = db
      .select({
        scarId: scarImage.id,
        analyticsId: analytics.id,
        nvdi: ndviStats,
      })
      .from(scarImage)
      .leftJoin(analytics, eq(analytics.id, scarImage.analyticsId))
      .innerJoin(ndviStats, eq(ndviStats.analyticsId, analytics.id))
      .where(eq(scarImage.id, scarId))

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError(
        'Error ao buscar estatísticas de NDVI',
        503,
        'ERROR_GET_NDVI_STATS'
      )
    }

    const { id, analyticsId, ...nvdi } = data[0].nvdi

    const parsedData = NdviStatsSchema.parse(nvdi)

    return {
      scarId: data[0].scarId,
      analyticsId: data[0].analyticsId,
      nvdiId: id,
      ...parsedData,
    }
  }

  async getNvdiSummaryStats({ scarId }: GetAreaStatsProps) {
    const query = db
      .select({
        scarId: scarImage.id,
        analyticsId: analytics.id,
        nvdiId: ndviStats.id,
        min: ndviStats.min,
        max: ndviStats.max,
        mean: ndviStats.mean,
        pctAcima05: ndviStats.pct_acima_0_5,
        std: ndviStats.std,
      })
      .from(scarImage)
      .leftJoin(analytics, eq(analytics.id, scarImage.analyticsId))
      .innerJoin(ndviStats, eq(ndviStats.analyticsId, analytics.id))
      .where(eq(scarImage.id, scarId))

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError(
        'Error ao buscar estatísticas de NDVI',
        503,
        'ERROR_GET_NDVI_STATS'
      )
    }

    return data[0]
  }

  async getAreaSummary({ scarId }: GetAreaStatsProps) {
    const query = db
      .select({
        scarId: scarImage.id,
        analyticsId: analytics.id,
        summaryId: areaSummary.id,
        totalAreaKm2: areaSummary.total_area_km2,
        burnedAreaKm2: areaSummary.burned_area_km2,
        burnedPercent: areaSummary.burned_percent,
      })
      .from(scarImage)
      .leftJoin(analytics, eq(analytics.id, scarImage.analyticsId))
      .innerJoin(areaSummary, eq(areaSummary.analyticsId, analytics.id))
      .where(eq(scarImage.id, scarId))

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError(
        'Error ao buscar resumo de área queimada',
        503,
        'ERROR_GET_AREA_SUMMARY'
      )
    }

    return data[0]
  }

  async getAllDataAnalytics({ scarId }: GetAreaStatsProps) {
    const query = db
      .select({
        id: scarImage.id,
        analyticsId: analytics.id,
        stacId: scarImage.stacId,
        uploadId: scarImage.uploadId,
        areaStats: areaStats,
        ndviStats: ndviStats,
        areaSummary: areaSummary,
      })
      .from(scarImage)
      .innerJoin(analytics, eq(analytics.id, scarImage.analyticsId))
      .innerJoin(areaStats, eq(areaStats.analyticsId, analytics.id))
      .innerJoin(ndviStats, eq(ndviStats.analyticsId, analytics.id))
      .innerJoin(areaSummary, eq(areaSummary.analyticsId, analytics.id))
      .where(eq(scarImage.id, scarId))

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError(
        'Error ao buscar todos os dados de analytics',
        503,
        'ERROR_GET_ALL_DATA_ANALYTICS'
      )
    }

    return data[0]
  }

  async getAllLatestAnalytics() {
    const query = db
      .select({
        id: scarImage.id,
        analyticsId: analytics.id,
        stacId: scarImage.stacId,
        uploadId: scarImage.uploadId,
        areaStats: areaStats,
        ndviStats: ndviStats,
        areaSummary: areaSummary,
      })
      .from(scarImage)
      .innerJoin(analytics, eq(analytics.id, scarImage.analyticsId))
      .innerJoin(areaStats, eq(areaStats.analyticsId, analytics.id))
      .innerJoin(ndviStats, eq(ndviStats.analyticsId, analytics.id))
      .innerJoin(areaSummary, eq(areaSummary.analyticsId, analytics.id))
      .limit(5)

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError(
        'Error ao buscar todos os dados de analytics',
        503,
        'ERROR_GET_ALL_DATA_ANALYTICS'
      )
    }

    return data
  }

  async getAllAnalytics({
    startDate,
    endDate,
    limit,
    offset,
  }: GetAllAnalyticsProps) {
    const conditions = []

    const query = db
      .select({
        id: analytics.id,
        scarId: scarImage.id,
        bboxReal: analytics.bbox_real,
        createdAt: analytics.created_at,
      })
      .from(analytics)
      .innerJoin(scarImage, eq(scarImage.analyticsId, analytics.id))
      .leftJoin(stacImages, eq(stacImages.id, scarImage.stacId))

    if (startDate) {
      conditions.push(eq(stacImages.startDate, startDate))
    }

    if (endDate) {
      conditions.push(eq(stacImages.endDate, endDate))
    }

    if (conditions.length > 0) {
      query.where(and(...conditions))
    }

    if (limit) {
      query.limit(limit)
    }

    if (offset) {
      query.offset(offset)
    }

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError(
        'Error ao buscar todos os dados de analytics',
        503,
        'ERROR_GET_ALL_ANALYTICS'
      )
    }

    const response = AnalyticsResponseSchemaArray.safeParse(data)

    if (!response.success) {
      throw new CustomError(
        'Erro ao validar os dados de analytics',
        503,
        'ERROR_VALIDATING_ANALYTICS'
      )
    }

    return response.data
  }

  async searchLatLng({ lat, lng, page }: SearchLatLngProps) {
    const query = db
      .select()
      .from(analytics)
      .limit(10)
      .offset((page - 1) * 10)

    const [error, data] = await catchError(query)

    if (error) {
      throw new CustomError(
        'Erro ao buscar os dados de analytics',
        503,
        'ERROR_GET_ANALYTICS'
      )
    }

    const result = data.filter(item => {
      try {
        const poly = this.generatePolygon(item.bbox_real)
        return this.analyzePolygon(poly.geometry.coordinates).contains(lng, lat)
      } catch {
        return false
      }
    })

    const parsedResult = result.map(item => {
      const result = LatLngSchema.safeParse(item)
      if (!result.success) {
        throw new CustomError(
          'Erro ao validar os dados de analytics',
          503,
          'ERROR_VALIDATING_ANALYTICS'
        )
      }
      return result.data
    })

    return parsedResult
  }

  async generateGeometry({ scarId }: GetAreaStatsProps) {
    const query = db
      .select({
        bbox: analytics.bbox_real,
        geometry: stacImages.geometry,
      })
      .from(analytics)
      .leftJoin(scarImage, eq(scarImage.analyticsId, analytics.id))
      .innerJoin(stacImages, eq(stacImages.id, scarImage.stacId))
      .where(eq(scarImage.id, scarId))

    const [error, data] = await catchError(query)

    if (error) {
      throw new CustomError(
        'Erro ao buscar os dados de analytics',
        503,
        'ERROR_GET_ANALYTICS'
      )
    }

    if (data.length === 0) {
      throw new CustomError(
        'Nenhum dado encontrado para o ID fornecido',
        404,
        'DATA_NOT_FOUND'
      )
    }

    const poly = this.generatePolygon(data[0].geometry)

    const { areaKm2, bbox, centroid, perimeterKm } = this.analyzePolygon(
      poly.geometry.coordinates
    )

    const { ringCount, type, vertexCount } = this.getGeoJsonBoundsSummary(poly)

    return {
      areaKm2,
      perimeterKm,
      bbox,
      centroid,
      ringCount,
      type,
      vertexCount,
    }
  }

  async getStatsOverview() {
    const query = db
      .select({
        totalAreas: count(analytics.id),
        totalAreaKm2: sum(areaSummary.total_area_km2),
        totalBurnedKm2: sum(areaSummary.burned_area_km2),
        avgNdvi: avg(ndviStats.mean),
        minDate: min(analytics.created_at),
        maxDate: max(analytics.created_at),
      })
      .from(analytics)
      .innerJoin(areaSummary, eq(areaSummary.analyticsId, analytics.id))
      .innerJoin(ndviStats, eq(ndviStats.analyticsId, analytics.id))

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError('Erro ao buscar overview', 503, 'ERROR_OVERVIEW')
    }

    return data[0]
  }

  async getStatsPerMonth() {
    // Use SQL raw for date_trunc
    const monthExpr = sql<string>`date_trunc('month', ${analytics.created_at})`

    const query = db
      .select({
        month: monthExpr.as('month'),
        total: count(analytics.id),
        avgNdvi: avg(ndviStats.mean),
        burnedKm2: sum(areaSummary.burned_area_km2),
      })
      .from(analytics)
      .innerJoin(ndviStats, eq(ndviStats.analyticsId, analytics.id))
      .innerJoin(areaSummary, eq(areaSummary.analyticsId, analytics.id))
      .groupBy(monthExpr)
      .orderBy(monthExpr)

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError(
        'Erro ao buscar estatísticas mensais',
        503,
        'ERROR_STATS_PER_MONTH'
      )
    }

    return data
  }

  async getAllPolygonsAsGeoJSON() {
    const query = db
      .select({
        id: analytics.id,
        bbox: analytics.bbox_real,
      })
      .from(analytics)

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError('Erro ao gerar GeoJSON', 503, 'ERROR_GEOJSON')
    }

    const features = data.map(item => {
      const polygon = this.generatePolygon(item.bbox)
      return {
        type: 'Feature',
        properties: { id: item.id },
        geometry: polygon.geometry,
      }
    })

    return {
      type: 'FeatureCollection',
      features,
    }
  }

  async getHistogramsAverage() {
    const query = db
      .select({
        histogram: ndviStats.histogram,
      })
      .from(ndviStats)

    const [error, data] = await retryWithCatch(() => query)

    if (error) {
      throw new CustomError(
        'Erro ao buscar média dos histogramas',
        503,
        'ERROR_HISTOGRAM_AVERAGE'
      )
    }

    if (!data.length) return { averages: [] }

    const rangeMap = new Map<string, { count: number; total: number }>()

    for (const row of data) {
      const parsedHistogram = z.array(HistogramSchema).parse(row.histogram)

      for (const bin of parsedHistogram) {
        const key = JSON.stringify(bin.range)
        const entry = rangeMap.get(key) ?? { count: 0, total: 0 }
        entry.count += bin.count
        entry.total += 1
        rangeMap.set(key, entry)
      }
    }

    const averages = Array.from(rangeMap.entries()).map(
      ([range, { count, total }]) => ({
        range: JSON.parse(range) as [number, number],
        averageCount: count / total,
      })
    )

    averages.sort((a, b) => a.range[0] - b.range[0])

    return { averages }
  }
}
