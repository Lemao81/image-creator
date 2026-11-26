import { useEffect, useState } from 'react'
import type { CandidateImage } from '@/types'
import { hasTransparency } from '@/utils/helpers'
import type { Candidate } from '~/types'

export function useCandidateImage(candidate: Candidate): CandidateImage | null {
  const [image, setImage] = useState<CandidateImage | null>(null)

  useEffect(() => {
    const blob = new Blob([candidate.image])
    const url = URL.createObjectURL(blob)
    let active = true

    async function decodeImage(): Promise<void> {
      const bitmap = await createImageBitmap(blob)
      const { width, height } = bitmap
      const transparent = hasTransparency(bitmap)
      bitmap.close()
      if (active) {
        setImage({ url, width, height, transparent })
      }
    }

    decodeImage().catch(console.error)

    return () => {
      active = false
      URL.revokeObjectURL(url)
    }
  }, [candidate])

  return image
}
