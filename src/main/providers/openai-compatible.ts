import type { DecryptedProviderSettings, ImageProvider } from '#/types'

type ImagesResponse = {
  data: { b64_json?: string; url?: string }[]
}

async function fetchImage(url: string): Promise<Uint8Array<ArrayBuffer>> {
  const response = await fetch(url)
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
  async function generate(prompt: string): Promise<Uint8Array<ArrayBuffer>> {
    const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/images/generations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model, prompt, n: 1 }),
    })

    if (!response.ok) {
      throw new Error(`Image API responded with status ${response.status}`)
    }

    const [image] = ((await response.json()) as ImagesResponse).data
    if (image?.b64_json) {
      return Buffer.from(image.b64_json, 'base64')
    }

    if (image?.url) {
      return fetchImage(image.url)
    }

    throw new Error('Image API returned no image')
  }

  return { generate }
}
