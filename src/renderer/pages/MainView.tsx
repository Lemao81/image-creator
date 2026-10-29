import { CircleAlertIcon } from 'lucide-react'
import { type JSX, useEffect, useRef, useState } from 'react'
import { CandidateViewer } from '@/components/CandidateViewer'
import { MainHeader } from '@/components/MainHeader'
import { NoCandidate } from '@/components/NoCandidate'
import { OutputSizeFields } from '@/components/OutputSizeFields'
import { PromptForm } from '@/components/PromptForm'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { CandidateHistory, OutputSizeInput } from '@/types'
import { parseOutputSize } from '@/utils/helpers'
import { defaultOutputSize } from '~/constants'

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
  const [prompt, setPrompt] = useState('')
  const [history, setHistory] = useState<CandidateHistory>({ candidates: [], shown: 0 })
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<OutputSizeInput | null>(null)
  const runningGeneration = useRef<number | null>(null)
  const candidate = history.candidates.at(history.shown)
  const canAccept = outputSize !== null && parseOutputSize(outputSize) !== null

  useEffect(() => {
    async function restoreOutputSize(): Promise<void> {
      const stored = await window.bridge.loadOutputSize()
      const size = stored ?? defaultOutputSize
      setOutputSize({ width: String(size.width), height: String(size.height) })
    }

    restoreOutputSize().catch(console.error)
  }, [])

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

  async function handleGenerate(generationPrompt: string): Promise<void> {
    const generation = Date.now()
    runningGeneration.current = generation
    setStartedAt(generation)
    setError(null)

    try {
      const result = await window.bridge.generate(generationPrompt)
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

  function handleOutputSizeChange(size: OutputSizeInput): void {
    setOutputSize(size)
    const parsed = parseOutputSize(size)
    if (parsed) {
      window.bridge.storeOutputSize(parsed).catch(console.error)
    }
  }

  async function handleCancel(): Promise<void> {
    runningGeneration.current = null
    setStartedAt(null)
    await window.bridge.cancelGeneration()
  }

  return (
    <main className="flex flex-col">
      <MainHeader onOpenSettings={onOpenSettings} />
      <div className="flex flex-col gap-6 px-6 py-4">
        <PromptForm
          prompt={prompt}
          startedAt={startedAt}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          onCancel={handleCancel}
        />
        {outputSize && <OutputSizeFields size={outputSize} onSizeChange={handleOutputSizeChange} />}
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
            canAccept={canAccept}
            onShow={(o) => setHistory((h) => showOffset(h, o))}
            onUsePrompt={setPrompt}
            onAccept={(c) => window.bridge.accept(c)}
          />
        ) : (
          <NoCandidate />
        )}
      </div>
    </main>
  )
}
