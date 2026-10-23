import { createOpenAiCompatibleProvider } from '#/providers/openai-compatible'
import { errorMessage } from '#/utils/helpers'
import type { GenerationResult } from '~/types'
import { loadDecryptedProviderSettings } from './settings-store'

let runningGeneration: AbortController | null = null

export async function generate(prompt: string): Promise<GenerationResult> {
  const controller = new AbortController()
  runningGeneration = controller

  try {
    const provider = createOpenAiCompatibleProvider(await loadDecryptedProviderSettings())
    const image = await provider.generate(prompt, controller.signal)

    return { ok: true, candidate: { image, prompt } }
  } catch (error) {
    return { ok: false, message: errorMessage(error) }
  } finally {
    if (runningGeneration === controller) {
      runningGeneration = null
    }
  }
}

export function cancelGeneration(): void {
  runningGeneration?.abort()
}
