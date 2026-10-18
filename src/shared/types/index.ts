export type ProviderSettings = {
  baseUrl: string
  model: string
  hasApiKey: boolean
}

export type ProviderSettingsUpdate = {
  baseUrl: string
  model: string
  apiKey: string
}

export type Candidate = {
  image: Uint8Array
  prompt: string
}
