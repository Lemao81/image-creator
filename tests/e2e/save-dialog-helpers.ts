import type { ElectronApplication } from '@playwright/test'
import type { SaveDialogOptions } from 'electron'

export async function stubSaveDialog(
  app: ElectronApplication,
  filePath: string | undefined,
): Promise<void> {
  await app.evaluate(({ dialog }, chosenPath) => {
    dialog.showSaveDialog = async (...args: unknown[]) => {
      Object.assign(globalThis, { saveDialogOptions: args.at(-1) })

      return { canceled: chosenPath === undefined, filePath: chosenPath ?? '' }
    }
  }, filePath)
}

export function saveDialogShown(app: ElectronApplication): Promise<boolean> {
  return app.evaluate(() => 'saveDialogOptions' in globalThis)
}

export function saveDialogOptions(
  app: ElectronApplication,
): Promise<SaveDialogOptions | undefined> {
  return app.evaluate(
    () => (globalThis as { saveDialogOptions?: SaveDialogOptions }).saveDialogOptions,
  )
}
