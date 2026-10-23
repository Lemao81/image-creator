import type { DecryptedProviderSettings, ImageProvider } from '#/types'
import { endpoint } from '#/utils/helpers'

type ImagesResponse = {
  data: { b64_json?: string; url?: string }[]
}

type ErrorResponse = {
  error?: { message?: string }
}

async function apiError(response: Response): Promise<Error> {
  const body = (await response.json().catch(() => null)) as ErrorResponse | null
  const message = body?.error?.message
  const status = `Image API responded with status ${response.status}`

  return new Error(message ? `${status}: ${message}` : status)
}

async function fetchImage(url: string, signal: AbortSignal): Promise<Uint8Array<ArrayBuffer>> {
  const response = await fetch(url, { signal })
  if (!response.ok) {
    throw new Error(`Image download failed with status ${response.status}`)
  }

  return new Uint8Array(await response.arrayBuffer())
}

export function createOpenAiCompatibleProvider({
  baseUrl,
  model,
  apiKey,
}: DecryptedProviderSettings): ImageProvider {
  async function generate(prompt: string, signal: AbortSignal): Promise<Uint8Array<ArrayBuffer>> {
    const response = await fetch(endpoint(baseUrl, '/images/generations'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, prompt, n: 1 }),
      signal,
    })

    if (!response.ok) {
      throw await apiError(response)
    }

    const [image] = ((await response.json()) as ImagesResponse).data
    if (image?.b64_json) {
      return Buffer.from(image.b64_json, 'base64')
    }

    if (image?.url) {
      return fetchImage(image.url, signal)
    }

    throw new Error('Image API returned no image')
  }

  async function testConnection(): Promise<void> {
    const response = await fetch(endpoint(baseUrl, '/models'), {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    if (!response.ok) {
      throw await apiError(response)
    }
  }

  return { generate, testConnection }
}
