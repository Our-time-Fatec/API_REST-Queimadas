import { registerPrefix } from '#/utils/registerPrefix'
import { helloWorldRoute } from './hello-world'

const routes = [helloWorldRoute]

const exampleRoute = '/api'

export const exampleRoutes = registerPrefix(routes, exampleRoute)
