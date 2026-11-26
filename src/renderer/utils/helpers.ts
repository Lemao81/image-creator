import type { CandidateImage, OutputSizeInput } from '@/types'
import { maxOutputSize } from '~/constants'
import type { OutputSize } from '~/types'

export function parseSizeValue(value: string): number | null {
  if (!/^\d+$/.test(value)) {
    return null
  }

  const size = Number(value)

  return size >= 1 && size <= maxOutputSize ? size : null
}

export function parseOutputSize({ width, height }: OutputSizeInput): OutputSize | null {
  const parsedWidth = parseSizeValue(width)
  const parsedHeight = parseSizeValue(height)

  return parsedWidth !== null && parsedHeight !== null
    ? { width: parsedWidth, height: parsedHeight }
    : null
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
