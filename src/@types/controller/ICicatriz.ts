import type { MultipartFile } from '@fastify/multipart'
import type { StacHttpInterface } from '../models/IStacModel'
import type { PaginationSchema } from '../utils'

export interface CreateCicatrizProps extends StacHttpInterface {
  JWT: string
  ignore_existing?: boolean
}

export interface FinalizeCicatrizProps {
  data: MultipartFile | undefined
  jobId: string
  status: string
}

export interface GetStatusCicatrizProps {
  jobId: string
}

export interface GetAllCicatrizProps extends PaginationSchema {
  startDate?: Date
  endDate?: Date
}

export interface GetCicatrizByIdProps {
  id: string
}

export interface GetCicatrizByBboxProps extends PaginationSchema {
  bbox: number[]
  startDate?: Date
  endDate?: Date
}
