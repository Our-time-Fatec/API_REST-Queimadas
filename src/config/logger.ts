import type { FastifyInstance } from 'fastify'
import pc from 'picocolors'
import { StatusCodes } from '#/enums/status-code'

export async function logger(app: FastifyInstance) {
  let startTime: number

  app.addHook('onRequest', (request, reply, done) => {
    startTime = Date.now()
    // console.info(
    //   pc.cyan('Request: ') + pc.magenta(`${request.method} ${request.url}`)
    // )
    done()
  })

  app.addHook('onResponse', (request, reply, done) => {
    const responseTime = Date.now() - startTime
    const statusCode = reply.statusCode
    let statusColor = pc.green

    switch (true) {
      case statusCode >= StatusCodes.MULTIPLE_CHOICES &&
        statusCode < StatusCodes.BAD_REQUEST:
        statusColor = pc.yellow
        break
      case statusCode >= StatusCodes.BAD_REQUEST:
        statusColor = pc.red
        break
    }

    if (
      !request.url.includes('/docs') &&
      !request.url.includes('/favicon.ico')
    ) {
      console.info(
        pc.yellow('Response: ') +
          statusColor(
            `${request.method} ${request.url} - ${statusCode} - ${responseTime}ms`
          )
      )
    }
    done()
  })
}
