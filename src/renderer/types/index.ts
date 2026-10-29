import type { Candidate, OutputSize } from '~/types'

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
