import { setTimeout } from 'node:timers/promises'
import type { ImageProvider } from '#/types'
import candidateImage from '../../../fixtures/images/candidate.png?inline'
import otherCandidateImage from '../../../fixtures/images/other-candidate.png?inline'

const generationDelayMs = 1500

const images = [candidateImage, otherCandidateImage].map((d) =>
  Buffer.from(d.slice(d.indexOf(',') + 1), 'base64'),
)

let generationCount = 0

export function createFakeProvider(): ImageProvider {
  async function generate(_prompt: string, signal: AbortSignal): Promise<Uint8Array<ArrayBuffer>> {
    await setTimeout(generationDelayMs, undefined, { signal })
    const image = images[generationCount % images.length]
    generationCount += 1

    return image
  }

  async function testConnection(): Promise<void> {}

  return { generate, testConnection }
}
