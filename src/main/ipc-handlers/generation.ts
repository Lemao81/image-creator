import type { Candidate } from '../../shared/types'
import { createOpenAiCompatibleProvider } from '../providers/openai-compatible'
import { loadDecryptedProviderSettings } from './settings-store'

export async function generate(prompt: string): Promise<Candidate> {
  const provider = createOpenAiCompatibleProvider(await loadDecryptedProviderSettings())

  return { image: await provider.generate(prompt), prompt }
}
