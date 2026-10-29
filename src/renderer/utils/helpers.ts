import type { OutputSizeInput } from '@/types'
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
