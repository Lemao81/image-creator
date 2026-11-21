import { TriangleAlertIcon } from 'lucide-react'
import type { JSX } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { OutputSize } from '~/types'

type UpscalingWarningProps = {
  outputSize: OutputSize
}

export function UpscalingWarning({ outputSize }: UpscalingWarningProps): JSX.Element {
  return (
    <Alert role="status">
      <TriangleAlertIcon />
      <AlertTitle>Output will be upscaled</AlertTitle>
      <AlertDescription>
        The Candidate has fewer pixels than {outputSize.width}×{outputSize.height} at this aspect
        ratio, so the Output file may look blurry.
      </AlertDescription>
    </Alert>
  )
}
