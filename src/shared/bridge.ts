import type {
  Candidate,
  ConnectionTestResult,
  GenerationResult,
  ProviderSettings,
  ProviderSettingsUpdate,
} from './types'

export type Bridge = {
  loadProviderSettings: () => Promise<ProviderSettings | null>
  saveProviderSettings: (update: ProviderSettingsUpdate) => Promise<ProviderSettings>
  testConnection: (update: ProviderSettingsUpdate) => Promise<ConnectionTestResult>
  generate: (prompt: string) => Promise<GenerationResult>
  cancelGeneration: () => Promise<void>
  accept: (candidate: Candidate) => Promise<void>
  isFakeProvider: () => Promise<boolean>
}
