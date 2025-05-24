import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 60 }).notNull(),
  email: varchar('email').notNull().unique(),
  password: varchar('password', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at'),
  removedAt: timestamp('removed_at'),
})
