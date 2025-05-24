import {
  integer,
  jsonb,
  pgTable,
  real,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const analytics = pgTable('analytics', {
  id: serial('id').primaryKey(),
  bbox_real: jsonb('bbox_real').notNull(),
  created_at: timestamp('created_at').defaultNow(),
})

export const ndviStats = pgTable('ndvi_stats', {
  id: serial('id').primaryKey(),
  analyticsId: integer('analytics_id')
    .references(() => analytics.id)
    .notNull(),
  min: real('min').notNull(),
  max: real('max').notNull(),
  mean: real('mean').notNull(),
  std: real('std').notNull(),
  pct_acima_0_5: real('pct_acima_0_5').notNull(),
  histogram: jsonb('histogram').notNull(), // [{ range: [min, max], count }]
})

// Estatísticas de Área
export const areaStats = pgTable('area_stats', {
  id: serial('id').primaryKey(),
  analyticsId: integer('analytics_id')
    .references(() => analytics.id)
    .notNull(),
  total_area_m2: real('total_area_m2').notNull(),
  total_area_ha: real('total_area_ha').notNull(),
  por_classe: jsonb('por_classe').notNull(), // { classe1: { pixels, area_m2, ... }, ... }
})

// Resumo de área queimada
export const areaSummary = pgTable('area_summary', {
  id: serial('id').primaryKey(),
  analyticsId: integer('analytics_id')
    .references(() => analytics.id)
    .notNull(),
  total_area_km2: real('total_area_km2').notNull(),
  burned_area_km2: real('burned_area_km2').notNull(),
  burned_percent: real('burned_percent').notNull(),
})
