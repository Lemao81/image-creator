import { BrowserWindow, ipcMain } from 'electron'
import { IpcChannel } from '~/constants'
import type { Candidate, OutputFormat, OutputSize, ProviderSettingsUpdate } from '~/types'
import { accept } from './ipc-handlers/acceptance'
import { testConnection } from './ipc-handlers/connection-test'
import { cancelGeneration, generate } from './ipc-handlers/generation'
import {
  loadOutputFormat,
  loadOutputSize,
  loadProviderSettings,
  loadTransparentBackground,
  saveProviderSettings,
  storeOutputFormat,
  storeOutputSize,
  storeTransparentBackground,
} from './ipc-handlers/settings-store'

export function registerIpcHandlers(fakeProvider: boolean): void {
  ipcMain.handle(IpcChannel.loadProviderSettings, () => loadProviderSettings())
  ipcMain.handle(IpcChannel.saveProviderSettings, (_event, update: ProviderSettingsUpdate) =>
    saveProviderSettings(update),
  )

  ipcMain.handle(IpcChannel.testConnection, (_event, update: ProviderSettingsUpdate) =>
    testConnection(update, fakeProvider),
  )

  ipcMain.handle(
    IpcChannel.generate,
    (_event, prompt: string, outputSize: OutputSize, transparentBackground: boolean) =>
      generate(prompt, outputSize, transparentBackground, fakeProvider),
  )

  ipcMain.handle(IpcChannel.cancelGeneration, () => cancelGeneration())
  ipcMain.handle(
    IpcChannel.accept,
    (event, candidate: Candidate, outputSize: OutputSize, outputFormat: OutputFormat) =>
      accept(BrowserWindow.fromWebContents(event.sender), candidate, outputSize, outputFormat),
  )

  ipcMain.handle(IpcChannel.isFakeProvider, () => fakeProvider)

  ipcMain.handle(IpcChannel.loadOutputSize, () => loadOutputSize())
  ipcMain.handle(IpcChannel.storeOutputSize, (_event, size: OutputSize) => storeOutputSize(size))

  ipcMain.handle(IpcChannel.loadOutputFormat, () => loadOutputFormat())
  ipcMain.handle(IpcChannel.storeOutputFormat, (_event, format: OutputFormat) =>
    storeOutputFormat(format),
  )

  ipcMain.handle(IpcChannel.loadTransparentBackground, () => loadTransparentBackground())
  ipcMain.handle(IpcChannel.storeTransparentBackground, (_event, transparentBackground: boolean) =>
    storeTransparentBackground(transparentBackground),
  )
}
