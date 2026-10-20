import type {
  Candidate,
  ConnectionTestResult,
  ProviderSettings,
  ProviderSettingsUpdate,
} from './types'

export type Bridge = {
  loadProviderSettings: () => Promise<ProviderSettings | null>
  saveProviderSettings: (update: ProviderSettingsUpdate) => Promise<ProviderSettings>
  testConnection: (update: ProviderSettingsUpdate) => Promise<ConnectionTestResult>
  generate: (prompt: string) => Promise<Candidate>
  accept: (candidate: Candidate) => Promise<void>
}
