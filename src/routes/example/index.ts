import { registerPrefix } from '#/utils/registerPrefix'
import { uploadRoute } from '../upload'
import { helloWorldRoute } from './hello-world'

const routes = [helloWorldRoute, uploadRoute]

const exampleRoute = '/example'

export const exampleRoutes = registerPrefix(routes, exampleRoute)
