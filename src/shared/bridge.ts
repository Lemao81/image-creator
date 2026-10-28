import type {
  Candidate,
  ConnectionTestResult,
  GenerationResult,
  OutputSize,
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
  loadOutputSize: () => Promise<OutputSize | null>
  storeOutputSize: (size: OutputSize) => Promise<void>
}
