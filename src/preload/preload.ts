import { contextBridge, ipcRenderer } from 'electron'
import type { Bridge } from '../shared/bridge'
import { IpcChannel } from '../shared/constants'

const bridge: Bridge = {
  loadProviderSettings: () => ipcRenderer.invoke(IpcChannel.loadProviderSettings),
  saveProviderSettings: (u) => ipcRenderer.invoke(IpcChannel.saveProviderSettings, u),
  generate: (p) => ipcRenderer.invoke(IpcChannel.generate, p),
}

contextBridge.exposeInMainWorld('bridge', bridge)
