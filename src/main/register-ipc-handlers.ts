import { BrowserWindow, ipcMain } from 'electron'
import { IpcChannel } from '~/constants'
import type { Candidate, ProviderSettingsUpdate } from '~/types'
import { accept } from './ipc-handlers/acceptance'
import { testConnection } from './ipc-handlers/connection-test'
import { generate } from './ipc-handlers/generation'
import { loadProviderSettings, saveProviderSettings } from './ipc-handlers/settings-store'

export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannel.loadProviderSettings, () => loadProviderSettings())
  ipcMain.handle(IpcChannel.saveProviderSettings, (_event, update: ProviderSettingsUpdate) =>
    saveProviderSettings(update),
  )

  ipcMain.handle(IpcChannel.testConnection, (_event, update: ProviderSettingsUpdate) =>
    testConnection(update),
  )

  ipcMain.handle(IpcChannel.generate, (_event, prompt: string) => generate(prompt))
  ipcMain.handle(IpcChannel.accept, (event, candidate: Candidate) =>
    accept(BrowserWindow.fromWebContents(event.sender), candidate),
  )
}
