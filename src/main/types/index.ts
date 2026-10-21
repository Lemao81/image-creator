export type StoredProviderSettings = {
  baseUrl: string
  model: string
  encryptedApiKey?: string
}

export type StoredSettings = {
  provider?: StoredProviderSettings
}

export type DecryptedProviderSettings = {
  baseUrl: string
  model: string
  apiKey: string
}

export type ImageProvider = {
  generate: (prompt: string, signal: AbortSignal) => Promise<Uint8Array<ArrayBuffer>>
  testConnection: () => Promise<void>
}
