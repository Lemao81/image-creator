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
  generate: (prompt: string) => Promise<Uint8Array>
}
