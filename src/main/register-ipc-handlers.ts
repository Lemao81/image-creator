import { ipcMain } from 'electron'
import { IpcChannel } from '~/constants'
import type { ProviderSettingsUpdate } from '~/types'
import { generate } from './ipc-handlers/generation'
import { loadProviderSettings, saveProviderSettings } from './ipc-handlers/settings-store'

export function registerIpcHandlers(): void {
  ipcMain.handle(IpcChannel.loadProviderSettings, () => loadProviderSettings())
  ipcMain.handle(IpcChannel.saveProviderSettings, (_event, update: ProviderSettingsUpdate) =>
    saveProviderSettings(update),
  )

  ipcMain.handle(IpcChannel.generate, (_event, prompt: string) => generate(prompt))
}
