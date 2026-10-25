import type { JSX } from 'react'
import { Button } from '@/components/ui/button'

type CandidateCaptionProps = {
  prompt: string
  onUsePrompt: (prompt: string) => void
}

export function CandidateCaption({ prompt, onUsePrompt }: CandidateCaptionProps): JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-muted-foreground">{prompt}</p>
      <Button variant="outline" size="sm" onClick={() => onUsePrompt(prompt)}>
        Use this prompt
      </Button>
    </div>
  )
}
