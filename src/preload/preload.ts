import { contextBridge, ipcRenderer } from 'electron'
import type { Bridge } from '~/bridge'
import { IpcChannel } from '~/constants'

const bridge: Bridge = {
  loadProviderSettings: () => ipcRenderer.invoke(IpcChannel.loadProviderSettings),
  saveProviderSettings: (u) => ipcRenderer.invoke(IpcChannel.saveProviderSettings, u),
  testConnection: (u) => ipcRenderer.invoke(IpcChannel.testConnection, u),
  generate: (p, s) => ipcRenderer.invoke(IpcChannel.generate, p, s),
  cancelGeneration: () => ipcRenderer.invoke(IpcChannel.cancelGeneration),
  accept: (c, s) => ipcRenderer.invoke(IpcChannel.accept, c, s),
  isFakeProvider: () => ipcRenderer.invoke(IpcChannel.isFakeProvider),
  loadOutputSize: () => ipcRenderer.invoke(IpcChannel.loadOutputSize),
  storeOutputSize: (s) => ipcRenderer.invoke(IpcChannel.storeOutputSize, s),
}

contextBridge.exposeInMainWorld('bridge', bridge)
