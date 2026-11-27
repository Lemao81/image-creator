import type { GenerationSize, OutputFormatFile } from '#/types'
import type { OutputFormat } from '~/types'

export const modelGenerationSizes: Record<string, GenerationSize[]> = {
  'gpt-image-1': [
    { width: 1024, height: 1024 },
    { width: 1536, height: 1024 },
    { width: 1024, height: 1536 },
  ],
  'gpt-image-1-mini': [
    { width: 1024, height: 1024 },
    { width: 1536, height: 1024 },
    { width: 1024, height: 1536 },
  ],
  'dall-e-3': [
    { width: 1024, height: 1024 },
    { width: 1792, height: 1024 },
    { width: 1024, height: 1792 },
  ],
  'dall-e-2': [
    { width: 256, height: 256 },
    { width: 512, height: 512 },
    { width: 1024, height: 1024 },
  ],
}

export const defaultGenerationSize: GenerationSize = { width: 1024, height: 1024 }

export const outputFormatFiles: Record<OutputFormat, OutputFormatFile> = {
  png: { extension: 'png', filterName: 'PNG image' },
  jpeg: { extension: 'jpg', filterName: 'JPEG image' },
  webp: { extension: 'webp', filterName: 'WebP image' },
  ico: { extension: 'ico', filterName: 'ICO icon' },
}
