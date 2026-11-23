import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { type BrowserWindow, dialog, type SaveDialogOptions } from 'electron'
import sharp, { type Sharp } from 'sharp'
import { outputFormatFiles } from '#/constants'
import { filenameSlug } from '#/utils/helpers'
import type { Candidate, OutputFormat, OutputSize } from '~/types'
import { loadSaveFolder, storeSaveFolder } from './settings-store'

function encode(image: Sharp, outputFormat: OutputFormat): Sharp {
  switch (outputFormat) {
    case 'png':
      return image.png()
    case 'jpeg':
      return image.flatten({ background: '#ffffff' }).jpeg()
    case 'webp':
      return image.webp()
  }
}

function outputImage(
  candidate: Candidate,
  outputSize: OutputSize,
  outputFormat: OutputFormat,
): Promise<Buffer> {
  const resized = sharp(candidate.image).resize(outputSize.width, outputSize.height, {
    fit: 'cover',
    position: 'centre',
  })

  return encode(resized, outputFormat).toBuffer()
}

export async function accept(
  window: BrowserWindow | null,
  candidate: Candidate,
  outputSize: OutputSize,
  outputFormat: OutputFormat,
): Promise<void> {
  const { extension, filterName } = outputFormatFiles[outputFormat]
  const filename = `${filenameSlug(candidate.prompt)}.${extension}`
  const saveFolder = await loadSaveFolder()
  const options: SaveDialogOptions = {
    defaultPath: saveFolder ? path.join(saveFolder, filename) : filename,
    filters: [{ name: filterName, extensions: [extension] }],
  }

  const { canceled, filePath } = window
    ? await dialog.showSaveDialog(window, options)
    : await dialog.showSaveDialog(options)

  if (canceled) {
    return
  }

  await storeSaveFolder(path.dirname(filePath))
  await writeFile(filePath, await outputImage(candidate, outputSize, outputFormat))
}
