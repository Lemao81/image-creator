import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { type BrowserWindow, dialog, type SaveDialogOptions } from 'electron'
import sharp from 'sharp'
import { filenameSlug } from '#/utils/helpers'
import type { Candidate, OutputSize } from '~/types'
import { loadSaveFolder, storeSaveFolder } from './settings-store'

function outputImage(candidate: Candidate, outputSize: OutputSize): Promise<Buffer> {
  return sharp(candidate.image)
    .resize(outputSize.width, outputSize.height, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer()
}

export async function accept(
  window: BrowserWindow | null,
  candidate: Candidate,
  outputSize: OutputSize,
): Promise<void> {
  const filename = `${filenameSlug(candidate.prompt)}.png`
  const saveFolder = await loadSaveFolder()
  const options: SaveDialogOptions = {
    defaultPath: saveFolder ? path.join(saveFolder, filename) : filename,
    filters: [{ name: 'PNG image', extensions: ['png'] }],
  }

  const { canceled, filePath } = window
    ? await dialog.showSaveDialog(window, options)
    : await dialog.showSaveDialog(options)

  if (canceled) {
    return
  }

  await storeSaveFolder(path.dirname(filePath))
  await writeFile(filePath, await outputImage(candidate, outputSize))
}
