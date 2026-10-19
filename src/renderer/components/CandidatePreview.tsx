import { type JSX, useEffect, useState } from 'react'
import type { Candidate } from '~/types'

type CandidatePreviewProps = {
  candidate: Candidate
}

export function CandidatePreview({ candidate }: CandidatePreviewProps): JSX.Element | null {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    const objectUrl = URL.createObjectURL(new Blob([candidate.image]))
    setUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [candidate])

  if (!url) {
    return null
  }

  return <img src={url} alt={candidate.prompt} className="max-w-full rounded-lg" />
}
