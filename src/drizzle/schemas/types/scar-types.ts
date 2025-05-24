import { pgEnum } from 'drizzle-orm/pg-core'
import { scarStatus } from '#/constants/scar-status'

export type ScarStatus = (typeof scarStatus)[number]

export const scarStatusEnum = pgEnum('scar_status', scarStatus)
