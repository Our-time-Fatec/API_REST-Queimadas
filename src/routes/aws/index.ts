import { registerPrefix } from '#/utils/registerPrefix'
import { uploadRoute } from './upload'

const routes = [uploadRoute]

const uploadPrefix = '/upload'

export const uploadRoutes = registerPrefix(routes, uploadPrefix)
