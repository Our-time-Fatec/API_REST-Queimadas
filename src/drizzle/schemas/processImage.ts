import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const processImage = pgTable('process_image', {
  id: serial('id').primaryKey(),
  fileLink: varchar('file_link').notNull(),
  referencesId: integer('references_id'),
  createdAt: timestamp('created_at').defaultNow(),
  removedAt: timestamp('removed_at'),
})
