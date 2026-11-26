import { contextBridge, ipcRenderer } from 'electron'
import type { Bridge } from '~/bridge'
import { IpcChannel } from '~/constants'

const bridge: Bridge = {
  loadProviderSettings: () => ipcRenderer.invoke(IpcChannel.loadProviderSettings),
  saveProviderSettings: (u) => ipcRenderer.invoke(IpcChannel.saveProviderSettings, u),
  testConnection: (u) => ipcRenderer.invoke(IpcChannel.testConnection, u),
  generate: (p, s, t) => ipcRenderer.invoke(IpcChannel.generate, p, s, t),
  cancelGeneration: () => ipcRenderer.invoke(IpcChannel.cancelGeneration),
  accept: (c, s, f) => ipcRenderer.invoke(IpcChannel.accept, c, s, f),
  isFakeProvider: () => ipcRenderer.invoke(IpcChannel.isFakeProvider),
  loadOutputSize: () => ipcRenderer.invoke(IpcChannel.loadOutputSize),
  storeOutputSize: (s) => ipcRenderer.invoke(IpcChannel.storeOutputSize, s),
  loadOutputFormat: () => ipcRenderer.invoke(IpcChannel.loadOutputFormat),
  storeOutputFormat: (f) => ipcRenderer.invoke(IpcChannel.storeOutputFormat, f),
  loadTransparentBackground: () => ipcRenderer.invoke(IpcChannel.loadTransparentBackground),
  storeTransparentBackground: (t) => ipcRenderer.invoke(IpcChannel.storeTransparentBackground, t),
}

contextBridge.exposeInMainWorld('bridge', bridge)
