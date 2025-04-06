import { fastify } from 'fastify'
import { env } from './settings/env'
import { portSettings } from './config/base-config'

const app = fastify()

app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running on port ${portSettings.PORT}`)
  console.log(`See the documentation on ${portSettings.BASE_URL}/docs`)
})
