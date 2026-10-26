import type { DecryptedProviderSettings, ImageProvider } from '#/types'
import { createFakeProvider } from './fake'
import { createOpenAiCompatibleProvider } from './openai-compatible'

export async function resolveProvider(
  fakeProvider: boolean,
  loadSettings: () => Promise<DecryptedProviderSettings>,
): Promise<ImageProvider> {
  return fakeProvider ? createFakeProvider() : createOpenAiCompatibleProvider(await loadSettings())
}
