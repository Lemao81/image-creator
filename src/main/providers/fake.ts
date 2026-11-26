import { setTimeout } from 'node:timers/promises'
import type { ImageProvider } from '#/types'
import type { OutputSize } from '~/types'
import candidateImage from '../../../fixtures/images/candidate.png?inline'
import otherCandidateImage from '../../../fixtures/images/other-candidate.png?inline'
import transparentCandidateImage from '../../../fixtures/images/transparent-candidate.png?inline'

const generationDelayMs = 1500

function decodeDataUrl(dataUrl: string): Buffer<ArrayBuffer> {
  return Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64')
}

const images = [candidateImage, otherCandidateImage].map(decodeDataUrl)

const transparentImage = decodeDataUrl(transparentCandidateImage)

let generationCount = 0

export function createFakeProvider(): ImageProvider {
  async function generate(
    _prompt: string,
    _outputSize: OutputSize,
    transparentBackground: boolean,
    signal: AbortSignal,
  ): Promise<Uint8Array<ArrayBuffer>> {
    await setTimeout(generationDelayMs, undefined, { signal })
    if (transparentBackground) {
      return transparentImage
    }

    const image = images[generationCount % images.length]
    generationCount += 1

    return image
  }

  async function testConnection(): Promise<void> {}

  return { generate, testConnection }
}
