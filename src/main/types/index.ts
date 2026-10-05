export type StoredProviderSettings = {
  baseUrl: string
  model: string
  encryptedApiKey?: string
}

export type StoredSettings = {
  provider?: StoredProviderSettings
}
