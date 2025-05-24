import { fastifyCors } from '@fastify/cors'
import multipart from '@fastify/multipart'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import type { FastifyInstance } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { style } from '#/themes/style'
import { portSettings, version } from './base-config'
import { logs } from './logs'
export function registerPlugins(app: FastifyInstance) {
  app.register(fastifyCors, {
    origin: [portSettings.BASE_URL, portSettings.WEB_URL],
  })

  app.register(multipart)
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'API REST - Cicatriz',
        description: 'API REST para o projeto Cicatriz',
        version: version,
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    theme: {
      css: [{ filename: 'theme.css', content: style }],
    },
  })

  logs(app)

  app.setSerializerCompiler(serializerCompiler)
  app.setValidatorCompiler(validatorCompiler)
}
