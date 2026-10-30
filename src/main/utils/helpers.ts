import { defaultGenerationSize, modelGenerationSizes } from '#/constants'
import type { GenerationSize } from '#/types'
import type { OutputSize } from '~/types'

export function endpoint(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}${path}`
}

export function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error)
  }

  return error.cause instanceof Error ? `${error.message}: ${error.cause.message}` : error.message
}

const maxSlugLength = 50

export function filenameSlug(prompt: string): string {
  const words = prompt.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  let slug = ''
  for (const word of words) {
    const extended = slug ? `${slug}-${word}` : word
    if (extended.length > maxSlugLength) {
      break
    }

    slug = extended
  }

  return slug || (words[0]?.slice(0, maxSlugLength) ?? 'candidate')
}

function aspectRatioDistance(size: GenerationSize, outputSize: OutputSize): number {
  return Math.abs(
    Math.log(size.width / size.height) - Math.log(outputSize.width / outputSize.height),
  )
}

function pixelCount(size: GenerationSize): number {
  return size.width * size.height
}

export function generationSize(model: string, outputSize: OutputSize): GenerationSize {
  const sizes = modelGenerationSizes[model]
  if (!sizes) {
    return defaultGenerationSize
  }

  const distance = Math.min(...sizes.map((s) => aspectRatioDistance(s, outputSize)))
  const closest = sizes
    .filter((s) => aspectRatioDistance(s, outputSize) === distance)
    .sort((a, b) => pixelCount(a) - pixelCount(b))

  return (
    closest.find((s) => s.width >= outputSize.width && s.height >= outputSize.height) ??
    closest[closest.length - 1]
  )
}
