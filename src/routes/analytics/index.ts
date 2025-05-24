import { registerPrefix } from '#/utils/registerPrefix'
import { getAllDataAnalyticsRoute } from './get-all-data-analytics-route'
import { getAnalytics } from './get-analytics'
import { getAreaStatsRoute } from './get-area-stats-route'
import { getAreaSummaryRoute } from './get-area-summary-route'
import { getGeometryRoute } from './get-geometry-route'
import { getHistogramAverageHistoryRoute } from './get-histogram-history-route'
import { getLastAnalyticsRoute } from './get-last-analytics-route'
import { getNvdiStatsRoute } from './get-nvdi-stats-route'
import { getNvdiSummaryRoute } from './get-nvdi-summary-route'
import { getStatsOverviewRoute } from './get-overview-route'
import { saveAnalyticsRoute } from './save-analytics-route'
import { searchLatLngRoute } from './search-lat-lng-route'

const routes = [
  getAllDataAnalyticsRoute,
  getAreaStatsRoute,
  getAreaSummaryRoute,
  getGeometryRoute,
  getHistogramAverageHistoryRoute,
  getLastAnalyticsRoute,
  getNvdiStatsRoute,
  getNvdiSummaryRoute,
  getStatsOverviewRoute,
  saveAnalyticsRoute,
  searchLatLngRoute,
  getAnalytics,
]

const analyticsPrefix = '/analytics'

export const analyticsRoutes = registerPrefix(routes, analyticsPrefix)
