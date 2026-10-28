import type { Candidate } from '~/types'

export type CandidateHistory = {
  candidates: Candidate[]
  shown: number
}

export type OutputSizeInput = {
  width: string
  height: string
}
