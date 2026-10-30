import type { OutputSize } from '~/types'

export type StoredProviderSettings = {
  baseUrl: string
  model: string
  encryptedApiKey?: string
}

export type StoredSettings = {
  provider?: StoredProviderSettings
  saveFolder?: string
  outputSize?: OutputSize
}

export type DecryptedProviderSettings = {
  baseUrl: string
  model: string
  apiKey: string
}

export type GenerationSize = {
  width: number
  height: number
}

export type ImageProvider = {
  generate: (
    prompt: string,
    outputSize: OutputSize,
    signal: AbortSignal,
  ) => Promise<Uint8Array<ArrayBuffer>>
  testConnection: () => Promise<void>
}
