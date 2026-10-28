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

export type ConnectionTestResult = { ok: true } | { ok: false; message: string }

export type Candidate = {
  image: Uint8Array<ArrayBuffer>
  prompt: string
}

export type OutputSize = {
  width: number
  height: number
}

export type GenerationResult = { ok: true; candidate: Candidate } | { ok: false; message: string }
