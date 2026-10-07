import { ArrowLeftIcon, CircleAlertIcon } from 'lucide-react'
import { type SubmitEvent, useEffect, useState } from 'react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type SettingsViewProps = {
  onBack: () => void
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function SettingsView({ onBack }: SettingsViewProps) {
  const [loaded, setLoaded] = useState(false)
  const [baseUrl, setBaseUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  const [hasApiKey, setHasApiKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const settings = await window.bridge.loadProviderSettings()
        if (settings) {
          setBaseUrl(settings.baseUrl)
          setModel(settings.model)
          setHasApiKey(settings.hasApiKey)
        }

        setLoaded(true)
      } catch (e) {
        setError(errorMessage(e))
      }
    }

    void load()
  }, [])

  function edit(setValue: (value: string) => void, value: string): void {
    setValue(value)
    setSaved(false)
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setError(null)
    try {
      const settings = await window.bridge.saveProviderSettings({ baseUrl, apiKey, model })
      setHasApiKey(settings.hasApiKey)
      setApiKey('')
      setSaved(true)
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  return (
    <main className="flex flex-col">
      <header className="flex items-center gap-2 p-2">
        <Button variant="ghost" size="icon" aria-label="Back" onClick={onBack}>
          <ArrowLeftIcon />
        </Button>
        <h1 className="font-heading text-lg font-medium">Settings</h1>
      </header>
      <div className="flex max-w-md flex-col gap-6 px-6 py-4">
        {loaded && (
          <form onSubmit={(e) => void handleSubmit(e)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="base-url">Base URL</FieldLabel>
                <Input
                  id="base-url"
                  type="url"
                  value={baseUrl}
                  placeholder="https://api.openai.com/v1"
                  onChange={(e) => edit(setBaseUrl, e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="api-key">API key</FieldLabel>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  autoComplete="off"
                  placeholder={hasApiKey ? 'Leave empty to keep the stored key' : undefined}
                  onChange={(e) => edit(setApiKey, e.target.value)}
                />
                <FieldDescription>
                  {hasApiKey ? 'An API key is set' : 'No API key set'}
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="model">Model</FieldLabel>
                <Input
                  id="model"
                  type="text"
                  value={model}
                  placeholder="gpt-image-1"
                  onChange={(e) => edit(setModel, e.target.value)}
                />
              </Field>
              <Field orientation="horizontal">
                <Button type="submit">Save</Button>
                {saved && (
                  <span role="status" className="text-sm text-muted-foreground">
                    Saved
                  </span>
                )}
              </Field>
            </FieldGroup>
          </form>
        )}
        {error && (
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
      </div>
    </main>
  )
}
