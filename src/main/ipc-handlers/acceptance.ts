import { writeFile } from 'node:fs/promises'
import { type BrowserWindow, dialog, type SaveDialogOptions } from 'electron'
import { filenameSlug } from '#/utils/helpers'
import type { Candidate } from '~/types'

export async function accept(window: BrowserWindow | null, candidate: Candidate): Promise<void> {
  const options: SaveDialogOptions = {
    defaultPath: `${filenameSlug(candidate.prompt)}.png`,
    filters: [{ name: 'PNG image', extensions: ['png'] }],
  }

  const { canceled, filePath } = window
    ? await dialog.showSaveDialog(window, options)
    : await dialog.showSaveDialog(options)

  if (canceled) {
    return
  }

  await writeFile(filePath, candidate.image)
}
