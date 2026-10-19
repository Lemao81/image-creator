import type { Candidate, ProviderSettings, ProviderSettingsUpdate } from './types'

export type Bridge = {
  loadProviderSettings: () => Promise<ProviderSettings | null>
  saveProviderSettings: (update: ProviderSettingsUpdate) => Promise<ProviderSettings>
  generate: (prompt: string) => Promise<Candidate>
  accept: (candidate: Candidate) => Promise<void>
}
