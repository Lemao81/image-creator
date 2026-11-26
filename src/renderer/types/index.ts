import type { Candidate, OutputFormat, OutputSize } from '~/types'

export type CandidateHistory = {
  candidates: Candidate[]
  shown: number
}

export type OutputSizeInput = {
  width: string
  height: string
}

export type OutputSizeState = {
  input: OutputSizeInput | null
  size: OutputSize | null
  change: (input: OutputSizeInput) => void
}

export type OutputFormatState = {
  format: OutputFormat | null
  change: (format: OutputFormat) => void
}

export type TransparentBackgroundState = {
  enabled: boolean | null
  change: (enabled: boolean) => void
}

export type CandidateImage = {
  url: string
  width: number
  height: number
  transparent: boolean
}
