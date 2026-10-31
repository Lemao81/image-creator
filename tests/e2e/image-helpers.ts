import sharp from 'sharp'

export type ImageInfo = {
  format: string | undefined
  width: number | undefined
  height: number | undefined
}

export async function imagePixels(filePath: string): Promise<Buffer | null> {
  return sharp(filePath)
    .raw()
    .toBuffer()
    .catch(() => null)
}

export async function imageInfo(filePath: string): Promise<ImageInfo | null> {
  const metadata = await sharp(filePath)
    .metadata()
    .catch(() => null)

  return metadata && { format: metadata.format, width: metadata.width, height: metadata.height }
}
