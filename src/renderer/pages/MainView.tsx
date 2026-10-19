import { ImageIcon, SettingsIcon } from 'lucide-react'
import { type JSX, type SubmitEvent, useState } from 'react'
import { CandidatePreview } from '@/components/CandidatePreview'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import type { Candidate } from '~/types'

type MainViewProps = {
  onOpenSettings: () => void
}

export function MainView({ onOpenSettings }: MainViewProps): JSX.Element {
  const [prompt, setPrompt] = useState('')
  const [candidate, setCandidate] = useState<Candidate | null>(null)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setCandidate(await window.bridge.generate(prompt))
  }

  return (
    <main className="flex flex-col">
      <header className="flex items-center justify-end p-2">
        <Button variant="ghost" size="icon" aria-label="Settings" onClick={onOpenSettings}>
          <SettingsIcon />
        </Button>
      </header>
      <div className="flex flex-col gap-6 px-6 py-4">
        <form onSubmit={(e) => handleSubmit(e).catch(console.error)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="prompt">Prompt</FieldLabel>
              <Textarea
                id="prompt"
                value={prompt}
                placeholder="A watercolour fox in a snowy forest"
                onChange={(e) => setPrompt(e.target.value)}
              />
            </Field>
            <Field orientation="horizontal">
              <Button type="submit" disabled={!prompt.trim()}>
                Generate
              </Button>
            </Field>
          </FieldGroup>
        </form>
        {candidate ? (
          <div className="flex flex-col items-start gap-4">
            <CandidatePreview candidate={candidate} />
            <Button onClick={() => window.bridge.accept(candidate).catch(console.error)}>
              Accept
            </Button>
          </div>
        ) : (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>No Candidate yet</EmptyTitle>
              <EmptyDescription>Enter a Prompt and press Generate.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </main>
  )
}
