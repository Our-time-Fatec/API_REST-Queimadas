import { registerPrefix } from '#/utils/registerPrefix'
import { analyticsCicatrizRoute } from './analytics-cicatriz-route'
import { createCicatrizRoute } from './create-cicatriz-route'
import { finalizeCicatrizRoute } from './finalize-cicatriz-route'
import { searchAllCicatrizRoute } from './search-all-cicatriz'
import { searchCicatrizByBboxRoute } from './search-bbox-route'
import { searchCicatrizByIdRoute } from './search-id-route'
import { statusCicatrizRoute } from './status-route'

const routes = [
  createCicatrizRoute,
  finalizeCicatrizRoute,
  searchCicatrizByIdRoute,
  searchCicatrizByBboxRoute,
  searchAllCicatrizRoute,
  statusCicatrizRoute,
  analyticsCicatrizRoute,
]

const cicatrizRoute = '/cicatriz'

export const cicatrizRoutes = registerPrefix(routes, cicatrizRoute)
