import { eq } from 'drizzle-orm'
import type {
  FinalProcessResponse,
  GetStatusResponse,
  IAModelInterface,
  InitProcessProps,
  InitProcessResponse,
} from '#/@types/models/IIAModel'
import { http } from '#/client/http'
import { scarStatus } from '#/constants/scar-status'
import { db } from '#/drizzle/client'
import { scarImage } from '#/drizzle/schemas/scar'
import type { ScarStatus } from '#/drizzle/schemas/types/scar-types'
import { CustomError } from '#/errors/custom/CustomError'
import { env } from '#/settings/env'
import { catchError } from '#/utils/catchError'
import { retryWithCatch } from '#/utils/retry'

export class IAModel implements IAModelInterface {
  private isValidScarStatus = (status: string): status is ScarStatus =>
    scarStatus.includes(status as ScarStatus)

  async startProcess(props: InitProcessProps): Promise<InitProcessResponse> {
    const { id, band15_url, band16_url, bbox, JWT } = props

    const [err, data] = await retryWithCatch(() =>
      http<InitProcessResponse>(`${env.IA_URL}/ndvi/v3`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          band15_url,
          band16_url,
          bbox,
          JWT,
        }),
      })
    )

    if (err) {
      throw new CustomError(
        'Erro ao iniciar o processo',
        424,
        'PROCESS_START_ERROR'
      )
    }

    if (!this.isValidScarStatus(data.status)) {
      throw new CustomError(
        'Status do processo inválido',
        400,
        'INVALID_PROCESS_STATUS'
      )
    }

    const [scarError] = await catchError(
      db
        .insert(scarImage)
        .values({ stacId: id, status: data.status, jobId: data.jobId })
    )

    if (scarError) {
      throw new CustomError(
        'Erro ao salvar o processo',
        503,
        'PROCESS_SAVE_ERROR'
      )
    }

    return data
  }

  async checkAIStatus(): Promise<GetStatusResponse> {
    const [err, data] = await catchError(
      http<GetStatusResponse>(`${env.IA_URL}/check`)
    )

    if (err) {
      throw new CustomError(
        'Erro ao verificar o status do serviço de IA',
        424,
        'AI_SERVICE_CHECK_ERROR'
      )
    }

    return data
  }

  async getProcess(jobId: string): Promise<InitProcessResponse> {
    const [err, data] = await catchError(
      http<InitProcessResponse>(`${env.IA_URL}/status/${jobId}`)
    )

    if (err) {
      throw new CustomError(
        'Erro ao conferir o status do processo',
        424,
        'PROCESS_FETCH_ERROR'
      )
    }
    return data
  }

  async finalizeProcess({
    jobId,
    uploadId,
    status,
  }: FinalProcessResponse): Promise<void> {
    if (!this.isValidScarStatus(status)) {
      throw new CustomError(
        'Status do processo inválido',
        400,
        'INVALID_PROCESS_STATUS'
      )
    }

    const [err] = await retryWithCatch(() =>
      db
        .update(scarImage)
        .set({ uploadId, status })
        .where(eq(scarImage.jobId, jobId))
    )

    if (err) {
      throw new CustomError(
        'Erro ao finalizar o processo',
        503,
        'PROCESS_FINALIZE_ERROR'
      )
    }
  }
}

export const iaModel = new IAModel()
