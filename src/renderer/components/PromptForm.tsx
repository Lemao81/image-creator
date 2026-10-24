import { type JSX, type KeyboardEvent, type SubmitEvent, useState } from 'react'
import { GenerationProgress } from '@/components/GenerationProgress'
import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'

type PromptFormProps = {
  startedAt: number | null
  onGenerate: (prompt: string) => Promise<void>
  onCancel: () => Promise<void>
}

export function PromptForm({ startedAt, onGenerate, onCancel }: PromptFormProps): JSX.Element {
  const [prompt, setPrompt] = useState('')
  const canGenerate = prompt.trim() !== '' && startedAt === null

  function handleSubmit(event: SubmitEvent<HTMLFormElement>): void {
    event.preventDefault()
    onGenerate(prompt).catch(console.error)
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

  return (
    <form onSubmit={handleSubmit}>
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
                onClick={() => onCancel().catch(console.error)}
              >
                Cancel
              </Button>
              <GenerationProgress startedAt={startedAt} />
            </>
          )}
        </Field>
      </FieldGroup>
    </form>
  )
}
