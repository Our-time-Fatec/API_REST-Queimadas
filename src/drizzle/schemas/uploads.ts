import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const uploads = pgTable('uploads', {
  id: serial('id').primaryKey(),
  url: varchar('url').notNull(),
  originalFileName: integer('original_filename'),
  createdAt: timestamp('created_at').defaultNow(),
  removedAt: timestamp('removed_at'),
})
