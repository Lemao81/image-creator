import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { JSX } from 'react'
import { Button } from '@/components/ui/button'

type CandidateNavigationProps = {
  shown: number
  count: number
  onShow: (offset: number) => void
}

export function CandidateNavigation({
  shown,
  count,
  onShow,
}: CandidateNavigationProps): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous Candidate"
        disabled={shown === 0}
        onClick={() => onShow(-1)}
      >
        <ChevronLeftIcon />
      </Button>
      <span className="text-sm text-muted-foreground tabular-nums">
        {shown + 1} / {count}
      </span>
      <Button
        variant="outline"
        size="icon"
        aria-label="Next Candidate"
        disabled={shown === count - 1}
        onClick={() => onShow(1)}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  )
}
