import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const stacImages = pgTable('stac_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  itemId: text('item_id').notNull(),
  collection: text('collection').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull().defaultNow(),
  bbox: jsonb('bbox').notNull(),
  geometry: jsonb('geometry').notNull(),
  band_15: text('band_15').notNull(),
  band_16: text('band_16').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})
