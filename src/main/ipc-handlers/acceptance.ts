import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { type BrowserWindow, dialog, type SaveDialogOptions } from 'electron'
import { filenameSlug } from '#/utils/helpers'
import type { Candidate } from '~/types'
import { loadSaveFolder, storeSaveFolder } from './settings-store'

export async function accept(window: BrowserWindow | null, candidate: Candidate): Promise<void> {
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
  await writeFile(filePath, candidate.image)
}
