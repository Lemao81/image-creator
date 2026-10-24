import { ImageIcon } from 'lucide-react'
import type { JSX } from 'react'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

export function NoCandidate(): JSX.Element {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ImageIcon />
        </EmptyMedia>
        <EmptyTitle>No Candidate yet</EmptyTitle>
        <EmptyDescription>Enter a Prompt and press Generate.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}
