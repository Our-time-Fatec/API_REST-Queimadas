import type { SaveAnalyticsProps } from '#/@types/models/IAnalyticsModel'
import type { PaginationSchema } from '../utils'

export interface SaveAnalyticsControllerProps extends SaveAnalyticsProps {
  jobId: string
}

export interface SearchLatLngProps {
  lat: number
  lng: number
  page: number
}

export interface GetAreaStatsProps {
  scarId: string
}

export interface GetAllAnalyticsProps extends PaginationSchema {
  startDate?: Date
  endDate?: Date
}
