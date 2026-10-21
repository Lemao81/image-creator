import { contextBridge, ipcRenderer } from 'electron'
import type { Bridge } from '~/bridge'
import { IpcChannel } from '~/constants'

const bridge: Bridge = {
  loadProviderSettings: () => ipcRenderer.invoke(IpcChannel.loadProviderSettings),
  saveProviderSettings: (u) => ipcRenderer.invoke(IpcChannel.saveProviderSettings, u),
  testConnection: (u) => ipcRenderer.invoke(IpcChannel.testConnection, u),
  generate: (p) => ipcRenderer.invoke(IpcChannel.generate, p),
  cancelGeneration: () => ipcRenderer.invoke(IpcChannel.cancelGeneration),
  accept: (c) => ipcRenderer.invoke(IpcChannel.accept, c),
}

contextBridge.exposeInMainWorld('bridge', bridge)
