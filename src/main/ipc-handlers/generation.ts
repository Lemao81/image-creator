import { createOpenAiCompatibleProvider } from '#/providers/openai-compatible'
import type { Candidate } from '~/types'
import { loadDecryptedProviderSettings } from './settings-store'

let runningGeneration: AbortController | null = null

export async function generate(prompt: string): Promise<Candidate> {
  const controller = new AbortController()
  runningGeneration = controller

  try {
    const provider = createOpenAiCompatibleProvider(await loadDecryptedProviderSettings())

    return { image: await provider.generate(prompt, controller.signal), prompt }
  } finally {
    if (runningGeneration === controller) {
      runningGeneration = null
    }
  }
}

export function cancelGeneration(): void {
  runningGeneration?.abort()
}
