export interface InitProcessProps {
  id: string
  band15_url: string
  band16_url: string
  bbox: number[]
  JWT: string
}

export interface InitProcessResponse {
  jobId: string
  status: string
  message: string
}

export interface FinalProcessResponse {
  jobId: string
  status: string
  uploadId: number
}

export interface GetStatusResponse {
  message: string
}

export interface IAModelInterface {
  startProcess: (props: InitProcessProps) => Promise<InitProcessResponse>
  checkAIStatus: () => Promise<GetStatusResponse>
  getProcess: (jobId: string) => Promise<InitProcessResponse>
  finalizeProcess: (props: FinalProcessResponse) => Promise<void>
}
