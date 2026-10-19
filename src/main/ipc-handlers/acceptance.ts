import { writeFile } from 'node:fs/promises'
import { type BrowserWindow, dialog, type SaveDialogOptions } from 'electron'
import type { Candidate } from '~/types'

const saveDialogOptions: SaveDialogOptions = {
  filters: [{ name: 'PNG image', extensions: ['png'] }],
}

export async function accept(window: BrowserWindow | null, candidate: Candidate): Promise<void> {
  const { canceled, filePath } = window
    ? await dialog.showSaveDialog(window, saveDialogOptions)
    : await dialog.showSaveDialog(saveDialogOptions)

  if (canceled) {
    return
  }

  await writeFile(filePath, candidate.image)
}
