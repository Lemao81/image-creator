import type { ElectronApplication } from '@playwright/test'

export async function stubSaveDialog(
  app: ElectronApplication,
  filePath: string | undefined,
): Promise<void> {
  await app.evaluate(({ dialog }, chosenPath) => {
    dialog.showSaveDialog = async () => {
      Object.assign(globalThis, { saveDialogShown: true })

      return { canceled: chosenPath === undefined, filePath: chosenPath ?? '' }
    }
  }, filePath)
}

export function saveDialogShown(app: ElectronApplication): Promise<boolean> {
  return app.evaluate(() => 'saveDialogShown' in globalThis)
}
