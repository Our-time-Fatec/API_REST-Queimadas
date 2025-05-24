import z from 'zod'

export const scarStatus = [
  'pending',
  'processing',
  'completed',
  'failed',
] as const

export const scarStatusEnum = z.enum(scarStatus)
