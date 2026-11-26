import type { JSX } from 'react'
import { CandidateCaption } from '@/components/CandidateCaption'
import { CandidateNavigation } from '@/components/CandidateNavigation'
import { CandidatePreview } from '@/components/CandidatePreview'
import { JpegTransparencyHint } from '@/components/JpegTransparencyHint'
import { UpscalingWarning } from '@/components/UpscalingWarning'
import { Button } from '@/components/ui/button'
import { useCandidateImage } from '@/hooks/use-candidate-image'
import { cropScale } from '@/utils/helpers'
import type { Candidate, OutputFormat, OutputSize } from '~/types'

type CandidateViewerProps = {
  candidate: Candidate
  shown: number
  count: number
  outputSize: OutputSize | null
  outputFormat: OutputFormat | null
  onShow: (offset: number) => void
  onUsePrompt: (prompt: string) => void
  onAccept: (candidate: Candidate) => Promise<void>
}

export function CandidateViewer({
  candidate,
  shown,
  count,
  outputSize,
  outputFormat,
  onShow,
  onUsePrompt,
  onAccept,
}: CandidateViewerProps): JSX.Element {
  const image = useCandidateImage(candidate)
  const upscaled = image !== null && outputSize !== null && cropScale(image, outputSize) < 1
  const flattened = image?.transparent && outputFormat === 'jpeg'

  return (
    <div className="flex flex-col items-start gap-4">
      {image && (
        <CandidatePreview image={image} prompt={candidate.prompt} outputSize={outputSize} />
      )}
      {upscaled && <UpscalingWarning outputSize={outputSize} />}
      {flattened && <JpegTransparencyHint />}
      <CandidateCaption prompt={candidate.prompt} onUsePrompt={onUsePrompt} />
      <CandidateNavigation shown={shown} count={count} onShow={onShow} />
      <Button
        disabled={outputSize === null}
        onClick={() => onAccept(candidate).catch(console.error)}
      >
        Accept
      </Button>
    </div>
  )
}
