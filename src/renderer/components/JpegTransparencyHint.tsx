import { InfoIcon } from 'lucide-react'
import type { JSX } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function JpegTransparencyHint(): JSX.Element {
  return (
    <Alert role="status">
      <InfoIcon />
      <AlertTitle>JPEG has no transparency</AlertTitle>
      <AlertDescription>
        The Candidate has transparent areas, which turn white in a JPEG Output file.
      </AlertDescription>
    </Alert>
  )
}
