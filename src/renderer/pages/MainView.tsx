import { CircleAlertIcon, ImageIcon, SettingsIcon } from 'lucide-react'
import { type JSX, useEffect, useRef, useState } from 'react'
import { CandidateViewer } from '@/components/CandidateViewer'
import { PromptForm } from '@/components/PromptForm'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import type { CandidateHistory } from '@/types'

type MainViewProps = {
  onOpenSettings: () => void
}

function showOffset(history: CandidateHistory, offset: number): CandidateHistory {
  const shown = Math.max(Math.min(history.shown + offset, history.candidates.length - 1), 0)

  return { ...history, shown }
}

function isTextField(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.matches('input, textarea, select'))
  )
}

export function MainView({ onOpenSettings }: MainViewProps): JSX.Element {
  const [history, setHistory] = useState<CandidateHistory>({ candidates: [], shown: 0 })
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const runningGeneration = useRef<number | null>(null)
  const candidate = history.candidates.at(history.shown)

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent): void {
      if (isTextField(event.target)) {
        return
      }

      if (event.key === 'ArrowLeft') {
        setHistory((h) => showOffset(h, -1))
      } else if (event.key === 'ArrowRight') {
        setHistory((h) => showOffset(h, 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  async function handleGenerate(prompt: string): Promise<void> {
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
        const { candidate: generated } = result
        setHistory((h) => ({
          candidates: [...h.candidates, generated],
          shown: h.candidates.length,
        }))
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
        <PromptForm startedAt={startedAt} onGenerate={handleGenerate} onCancel={handleCancel} />
        {error && (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>Generation failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {candidate ? (
          <CandidateViewer
            candidate={candidate}
            shown={history.shown}
            count={history.candidates.length}
            onShow={(o) => setHistory((h) => showOffset(h, o))}
            onAccept={(c) => window.bridge.accept(c)}
          />
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
