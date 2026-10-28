import { BrowserWindow, ipcMain } from 'electron'
import { IpcChannel } from '~/constants'
import type { Candidate, OutputSize, ProviderSettingsUpdate } from '~/types'
import { accept } from './ipc-handlers/acceptance'
import { testConnection } from './ipc-handlers/connection-test'
import { cancelGeneration, generate } from './ipc-handlers/generation'
import {
  loadOutputSize,
  loadProviderSettings,
  saveProviderSettings,
  storeOutputSize,
} from './ipc-handlers/settings-store'

export function registerIpcHandlers(fakeProvider: boolean): void {
  ipcMain.handle(IpcChannel.loadProviderSettings, () => loadProviderSettings())
  ipcMain.handle(IpcChannel.saveProviderSettings, (_event, update: ProviderSettingsUpdate) =>
    saveProviderSettings(update),
  )

  ipcMain.handle(IpcChannel.testConnection, (_event, update: ProviderSettingsUpdate) =>
    testConnection(update, fakeProvider),
  )

  ipcMain.handle(IpcChannel.generate, (_event, prompt: string) => generate(prompt, fakeProvider))
  ipcMain.handle(IpcChannel.cancelGeneration, () => cancelGeneration())
  ipcMain.handle(IpcChannel.accept, (event, candidate: Candidate) =>
    accept(BrowserWindow.fromWebContents(event.sender), candidate),
  )

  ipcMain.handle(IpcChannel.isFakeProvider, () => fakeProvider)

  ipcMain.handle(IpcChannel.loadOutputSize, () => loadOutputSize())
  ipcMain.handle(IpcChannel.storeOutputSize, (_event, size: OutputSize) => storeOutputSize(size))
}
