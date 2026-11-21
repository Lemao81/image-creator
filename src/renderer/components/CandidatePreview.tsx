import type { JSX } from 'react'
import type { CandidateImage } from '@/types'
import { cropScale } from '@/utils/helpers'
import type { OutputSize } from '~/types'

type CandidatePreviewProps = {
  image: CandidateImage
  prompt: string
  outputSize: OutputSize | null
}

export function CandidatePreview({
  image,
  prompt,
  outputSize,
}: CandidatePreviewProps): JSX.Element {
  const style = outputSize && {
    width: outputSize.width * cropScale(image, outputSize),
    aspectRatio: `${outputSize.width} / ${outputSize.height}`,
  }

  return (
    <img
      src={image.url}
      alt={prompt}
      style={style ?? undefined}
      className="max-w-full rounded-lg object-cover"
    />
  )
}
