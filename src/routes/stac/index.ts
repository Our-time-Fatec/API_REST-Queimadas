import { registerPrefix } from '#/utils/registerPrefix'
import { stacSearchRoute } from './search'

const routes = [stacSearchRoute]

const burnPrefix = '/stac'

export const burnRoutes = registerPrefix(routes, burnPrefix)
