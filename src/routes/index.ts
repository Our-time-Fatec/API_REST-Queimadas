import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { analyticsRoutes } from './analytics'
import { uploadRoutes } from './aws'
import { cicatrizRoutes } from './cicatriz'
import { exampleRoutes } from './example'
import { burnRoutes } from './stac'

export const routes: FastifyPluginAsyncZod[] = []

routes.push(exampleRoutes)
routes.push(uploadRoutes)
routes.push(burnRoutes)
routes.push(cicatrizRoutes)
routes.push(analyticsRoutes)
