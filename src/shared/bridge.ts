import type {
  Candidate,
  ConnectionTestResult,
  GenerationResult,
  OutputFormat,
  OutputSize,
  ProviderSettings,
  ProviderSettingsUpdate,
} from './types'

export type Bridge = {
  loadProviderSettings: () => Promise<ProviderSettings | null>
  saveProviderSettings: (update: ProviderSettingsUpdate) => Promise<ProviderSettings>
  testConnection: (update: ProviderSettingsUpdate) => Promise<ConnectionTestResult>
  generate: (
    prompt: string,
    outputSize: OutputSize,
    transparentBackground: boolean,
  ) => Promise<GenerationResult>
  cancelGeneration: () => Promise<void>
  accept: (
    candidate: Candidate,
    outputSize: OutputSize,
    outputFormat: OutputFormat,
  ) => Promise<void>
  isFakeProvider: () => Promise<boolean>
  loadOutputSize: () => Promise<OutputSize | null>
  storeOutputSize: (size: OutputSize) => Promise<void>
  loadOutputFormat: () => Promise<OutputFormat | null>
  storeOutputFormat: (format: OutputFormat) => Promise<void>
  loadTransparentBackground: () => Promise<boolean | null>
  storeTransparentBackground: (transparentBackground: boolean) => Promise<void>
}
