import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { app, BrowserWindow } from 'electron'
import started from 'electron-squirrel-startup'
import { registerIpcHandlers } from './register-ipc-handlers'

if (started) {
  app.quit()
}

const fakeProvider = !app.isPackaged && app.commandLine.hasSwitch('fake-provider')
if (fakeProvider) {
  const userDataDir = path.join(app.getPath('userData'), 'fake-provider')
  mkdirSync(userDataDir, { recursive: true })
  app.setPath('userData', userDataDir)
}

registerIpcHandlers(fakeProvider)

function loadRenderer(window: BrowserWindow): Promise<void> {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    return window.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  }

  return window.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
}

function createMainWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  loadRenderer(mainWindow).catch(console.error)
}

app.on('ready', createMainWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})
