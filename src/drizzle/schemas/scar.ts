import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { analytics } from './analytics'
import { stacImages } from './stac'
import { scarStatusEnum } from './types/scar-types'
import { uploads } from './uploads'

export const scarImage = pgTable('scar_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  stacId: uuid('stac_id')
    .references(() => stacImages.id)
    .notNull(),
  uploadId: integer('upload_id').references(() => uploads.id),
  analyticsId: integer('analytics_id').references(() => analytics.id),
  jobId: text('job_id').notNull(),
  status: scarStatusEnum('status').notNull().default('processing'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
