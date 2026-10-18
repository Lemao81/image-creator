import { ipcMain } from 'electron'
import { IpcChannel } from '../shared/constants'
import type { ProviderSettingsUpdate } from '../shared/types'
import { generate } from './generation'
import { loadProviderSettings, saveProviderSettings } from './settings-store'

export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannel.loadProviderSettings, () => loadProviderSettings())
  ipcMain.handle(IpcChannel.saveProviderSettings, (_event, update: ProviderSettingsUpdate) =>
    saveProviderSettings(update),
  )

  ipcMain.handle(IpcChannel.generate, (_event, prompt: string) => generate(prompt))
}
