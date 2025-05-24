import {
  area,
  bbox,
  booleanPointInPolygon,
  centroid,
  length,
  point,
  polygon,
} from '@turf/turf'
import type {
  Feature,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
  Position,
} from 'geojson'
import type { Geometry } from '#/@types/stac/IResponse'
import { geometrySchema } from '#/routes/cicatriz/schema/schemas'
import { logger } from '#/settings/logger'

export type PolygonAnalytics = {
  areaKm2: number
  perimeterKm: number
  bbox: [number, number, number, number]
  centroid: [number, number] // [lng, lat]
  contains: (lng: number, lat: number) => boolean
}

type GeoJsonBoundsSummary = {
  type: 'Polygon' | 'MultiPolygon'
  bbox: [number, number, number, number]
  ringCount: number
  vertexCount: number
}

export class UtilClass {
  separarData(caminho: string) {
    const partes = caminho.split('/', 2)
    logger.log('partes', partes)
    return {
      startDate: partes[0] || '',
      endDate: partes[1] || '',
    }
  }

  generatePolygon(geometry: unknown) {
    const result = this.parseGeometry(geometry)
    const poly = polygon(result.coordinates)
    return poly
  }

  private parseGeometry(geometry: unknown): Geometry {
    const result = geometrySchema.parse(geometry)

    return result
  }

  analyzePolygon(coords: Position[][]): PolygonAnalytics {
    const poly = polygon(coords)

    return {
      areaKm2: +(area(poly) / 1e6).toFixed(2),
      perimeterKm: +length(poly, { units: 'kilometers' }).toFixed(2),
      bbox: bbox(poly) as [number, number, number, number],
      centroid: centroid(poly).geometry.coordinates as [number, number],
      contains: (lng: number, lat: number) =>
        booleanPointInPolygon(point([lng, lat]), poly),
    }
  }

  getGeoJsonBoundsSummary(
    input:
      | Feature<Polygon, GeoJsonProperties>
      | Feature<MultiPolygon, GeoJsonProperties>
  ): GeoJsonBoundsSummary {
    const type = input.geometry.type

    if (type === 'Polygon') {
      const coords = input.geometry.coordinates
      const ringCount = coords.length
      const vertexCount = coords.reduce((sum, ring) => sum + ring.length, 0)

      return {
        type,
        bbox: bbox(input) as [number, number, number, number],
        ringCount,
        vertexCount,
      }
    }

    if (type === 'MultiPolygon') {
      const coords = input.geometry.coordinates
      let ringCount = 0
      let vertexCount = 0

      for (const polygon of coords) {
        ringCount += polygon.length
        vertexCount += polygon.reduce((sum, ring) => sum + ring.length, 0)
      }

      return {
        type,
        bbox: bbox(input) as [number, number, number, number],
        ringCount,
        vertexCount,
      }
    }

    throw new Error('Unsupported geometry type')
  }

  fullProcess(geometry: unknown) {
    const result = this.parseGeometry(geometry)
    const poly = polygon(result.coordinates)

    const analytics = this.analyzePolygon(result.coordinates)
    const summary = this.getGeoJsonBoundsSummary(poly)

    return {
      areaKm2: analytics.areaKm2,
      perimeterKm: analytics.perimeterKm,
      bbox: summary.bbox,
      centroid: analytics.centroid,
      contains: analytics.contains,
      type: summary.type,
      ringCount: summary.ringCount,
      vertexCount: summary.vertexCount,
    }
  }
}
