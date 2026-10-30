import { resolveProvider } from '#/providers'
import { errorMessage } from '#/utils/helpers'
import type { GenerationResult, OutputSize } from '~/types'
import { loadDecryptedProviderSettings } from './settings-store'

let runningGeneration: AbortController | null = null

export async function generate(
  prompt: string,
  outputSize: OutputSize,
  fakeProvider: boolean,
): Promise<GenerationResult> {
  const controller = new AbortController()
  runningGeneration = controller

  try {
    const provider = await resolveProvider(fakeProvider, loadDecryptedProviderSettings)
    const image = await provider.generate(prompt, outputSize, controller.signal)

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
