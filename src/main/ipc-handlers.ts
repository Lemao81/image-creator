import { ipcMain } from 'electron'
import { IpcChannel } from '../shared/constants'
import type { ProviderSettingsUpdate } from '../shared/types'
import { loadProviderSettings, saveProviderSettings } from './settings-store'

export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannel.loadProviderSettings, () => loadProviderSettings())
  ipcMain.handle(IpcChannel.saveProviderSettings, (_event, update: ProviderSettingsUpdate) =>
    saveProviderSettings(update),
  )
}
