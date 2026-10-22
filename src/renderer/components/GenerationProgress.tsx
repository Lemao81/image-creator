import { type JSX, useEffect, useState } from 'react'
import { Spinner } from '@/components/ui/spinner'

type GenerationProgressProps = {
  startedAt: number
}

function elapsedSeconds(startedAt: number): number {
  return Math.floor((Date.now() - startedAt) / 1000)
}

export function GenerationProgress({ startedAt }: GenerationProgressProps): JSX.Element {
  const [seconds, setSeconds] = useState(() => elapsedSeconds(startedAt))

  useEffect(() => {
    const interval = setInterval(() => setSeconds(elapsedSeconds(startedAt)), 250)

    return () => clearInterval(interval)
  }, [startedAt])

  return (
    <div role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner aria-hidden />
      Generating… {seconds} s
    </div>
  )
}
