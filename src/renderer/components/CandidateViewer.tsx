import type { JSX } from 'react'
import { CandidateCaption } from '@/components/CandidateCaption'
import { CandidateNavigation } from '@/components/CandidateNavigation'
import { CandidatePreview } from '@/components/CandidatePreview'
import { Button } from '@/components/ui/button'
import type { Candidate } from '~/types'

type CandidateViewerProps = {
  candidate: Candidate
  shown: number
  count: number
  onShow: (offset: number) => void
  onUsePrompt: (prompt: string) => void
  onAccept: (candidate: Candidate) => Promise<void>
}

export function CandidateViewer({
  candidate,
  shown,
  count,
  onShow,
  onUsePrompt,
  onAccept,
}: CandidateViewerProps): JSX.Element {
  return (
    <div className="flex flex-col items-start gap-4">
      <CandidatePreview candidate={candidate} />
      <CandidateCaption prompt={candidate.prompt} onUsePrompt={onUsePrompt} />
      <CandidateNavigation shown={shown} count={count} onShow={onShow} />
      <Button onClick={() => onAccept(candidate).catch(console.error)}>Accept</Button>
    </div>
  )
}
