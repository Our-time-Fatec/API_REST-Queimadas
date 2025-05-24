import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.string().url(),
  WEB_URL: z.string().url(),
  IA_URL: z.string().url(),
  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
  CLOUD_FRONT_CDN: z.string().url(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  DEBUG_LEVEL: z.coerce.boolean().optional().default(false),
})

export const env = envSchema.parse(process.env)
