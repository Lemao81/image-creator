import { CircleAlertIcon, ImageIcon, SettingsIcon } from 'lucide-react'
import { type JSX, type KeyboardEvent, type SubmitEvent, useRef, useState } from 'react'
import { CandidatePreview } from '@/components/CandidatePreview'
import { GenerationProgress } from '@/components/GenerationProgress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const runningGeneration = useRef<number | null>(null)
  const canGenerate = prompt.trim() !== '' && startedAt === null

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const generation = Date.now()
    runningGeneration.current = generation
    setStartedAt(generation)
    setError(null)

    try {
      const result = await window.bridge.generate(prompt)
      if (runningGeneration.current !== generation) {
        return
      }

      if (result.ok) {
        setCandidate(result.candidate)
      } else {
        setError(result.message)
      }
    } finally {
      if (runningGeneration.current === generation) {
        runningGeneration.current = null
        setStartedAt(null)
      }
    }
  }

  function handlePromptKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (!event.ctrlKey || event.key !== 'Enter') {
      return
    }

    event.preventDefault()
    if (canGenerate) {
      event.currentTarget.form?.requestSubmit()
    }
  }

  async function handleCancel(): Promise<void> {
    runningGeneration.current = null
    setStartedAt(null)
    await window.bridge.cancelGeneration()
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
                onKeyDown={handlePromptKeyDown}
              />
            </Field>
            <Field orientation="horizontal">
              <Button type="submit" disabled={!canGenerate}>
                Generate
              </Button>
              {startedAt !== null && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleCancel().catch(console.error)}
                  >
                    Cancel
                  </Button>
                  <GenerationProgress startedAt={startedAt} />
                </>
              )}
            </Field>
          </FieldGroup>
        </form>
        {error && (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Generation failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
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
