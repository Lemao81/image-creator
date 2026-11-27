import { CircleAlertIcon } from 'lucide-react'
import { type JSX, useEffect, useRef, useState } from 'react'
import { CandidateViewer } from '@/components/CandidateViewer'
import { MainHeader } from '@/components/MainHeader'
import { NoCandidate } from '@/components/NoCandidate'
import { OutputFormatField } from '@/components/OutputFormatField'
import { OutputSizeFields } from '@/components/OutputSizeFields'
import { PromptForm } from '@/components/PromptForm'
import { TransparentBackgroundField } from '@/components/TransparentBackgroundField'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { FieldGroup } from '@/components/ui/field'
import { useOutputFormat } from '@/hooks/use-output-format'
import { useOutputSize } from '@/hooks/use-output-size'
import { useTransparentBackground } from '@/hooks/use-transparent-background'
import type { CandidateHistory } from '@/types'
import { icoSizeInput } from '@/utils/helpers'
import type { Candidate, OutputFormat } from '~/types'

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
  const runningGeneration = useRef<number | null>(null)
  const outputFormat = useOutputFormat()
  const outputSize = useOutputSize(outputFormat.format)
  const transparentBackground = useTransparentBackground()
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

  async function handleGenerate(generationPrompt: string): Promise<void> {
    if (!outputSize.size) {
      return
    }

    const generation = Date.now()
    runningGeneration.current = generation
    setStartedAt(generation)
    setError(null)

    try {
      const result = await window.bridge.generate(
        generationPrompt,
        outputSize.size,
        transparentBackground.enabled ?? false,
      )

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

  function handleFormatChange(format: OutputFormat): void {
    outputFormat.change(format)
    if (format === 'ico' && outputSize.input) {
      outputSize.change(icoSizeInput(outputSize.input))
    }
  }

  async function handleAccept(accepted: Candidate): Promise<void> {
    if (outputSize.size && outputFormat.format) {
      await window.bridge.accept(accepted, outputSize.size, outputFormat.format)
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
          hasOutputSize={outputSize.size !== null}
          onPromptChange={setPrompt}
          onGenerate={handleGenerate}
          onCancel={handleCancel}
        />
        <FieldGroup className="flex-row flex-wrap items-start">
          {outputSize.input && (
            <OutputSizeFields
              size={outputSize.input}
              format={outputFormat.format}
              onSizeChange={outputSize.change}
            />
          )}
          {outputFormat.format && (
            <OutputFormatField format={outputFormat.format} onFormatChange={handleFormatChange} />
          )}
          {transparentBackground.enabled !== null && (
            <TransparentBackgroundField
              enabled={transparentBackground.enabled}
              onEnabledChange={transparentBackground.change}
            />
          )}
        </FieldGroup>
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
            outputSize={outputSize.size}
            outputFormat={outputFormat.format}
            onShow={(o) => setHistory((h) => showOffset(h, o))}
            onUsePrompt={setPrompt}
            onAccept={handleAccept}
          />
        ) : (
          <NoCandidate />
        )}
      </div>
    </main>
  )
}
