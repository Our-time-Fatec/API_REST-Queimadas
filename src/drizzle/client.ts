import { PostgresJsDatabase, drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../settings/env'
import * as analytics from './schemas/analytics'
import { scarImage } from './schemas/scar'
import { stacImages } from './schemas/stac'
import { uploads } from './schemas/uploads'
import { users } from './schemas/user'

export const pg = postgres(env.POSTGRES_URL, {})
export const db = drizzle(pg, {
  schema: {
    users,
    uploads,
    stacImages,
    scarImage,
    analytics,
  },
})
export const dbMock = drizzle.mock({
  schema: { users, uploads, stacImages, scarImage, analytics },
})

export function createDbMock() {
  const dbMock = drizzle.mock({
    schema: { users, uploads, stacImages, scarImage, analytics },
  })

  return dbMock
}

export type Database = typeof db | typeof dbMock
