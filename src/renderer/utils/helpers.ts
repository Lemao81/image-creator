import type { CandidateImage, OutputSizeInput } from '@/types'
import { maxIcoSize, maxOutputSize } from '~/constants'
import type { OutputFormat, OutputSize } from '~/types'

export function outputSizeLimit(format: OutputFormat | null): number {
  return format === 'ico' ? maxIcoSize : maxOutputSize
}

export function parseSizeValue(value: string, limit: number): number | null {
  if (!/^\d+$/.test(value)) {
    return null
  }

  const size = Number(value)

  return size >= 1 && size <= limit ? size : null
}

export function parseOutputSize(
  { width, height }: OutputSizeInput,
  limit: number,
): OutputSize | null {
  const parsedWidth = parseSizeValue(width, limit)
  const parsedHeight = parseSizeValue(height, limit)

  return parsedWidth !== null && parsedHeight !== null
    ? { width: parsedWidth, height: parsedHeight }
    : null
}

export function icoSizeInput({ width }: OutputSizeInput): OutputSizeInput {
  const clamped = /^\d+$/.test(width) && Number(width) > maxIcoSize ? String(maxIcoSize) : width

  return { width: clamped, height: clamped }
}

export function cropScale(image: CandidateImage, outputSize: OutputSize): number {
  return Math.min(image.width / outputSize.width, image.height / outputSize.height)
}

export function hasTransparency(bitmap: ImageBitmap): boolean {
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
  const context = canvas.getContext('2d')
  if (!context) {
    return false
  }

  context.drawImage(bitmap, 0, 0)
  const { data } = context.getImageData(0, 0, bitmap.width, bitmap.height)

  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) {
      return true
    }
  }

  return false
}
