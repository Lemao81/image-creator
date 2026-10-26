import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  test as base,
  type ElectronApplication,
  _electron as electron,
  type Page,
} from '@playwright/test'
import { type FakeImageApi, startFakeImageApi } from './fake-image-api'

type Options = {
  appArgs: string[]
}

type Fixtures = {
  fakeImageApi: FakeImageApi
  userDataDir: string
  app: ElectronApplication
  window: Page
  relaunch: () => Promise<RelaunchedApp>
}

type RelaunchedApp = {
  app: ElectronApplication
  window: Page
}

const appRoot = path.join(__dirname, '..', '..')

function launchApp(userDataDir: string, appArgs: string[]): Promise<ElectronApplication> {
  return electron.launch({ args: [appRoot, `--user-data-dir=${userDataDir}`, ...appArgs] })
}

export const test = base.extend<Options & Fixtures>({
  appArgs: [[], { option: true }],
  fakeImageApi: async ({}, use) => {
    const api = await startFakeImageApi()
    await use(api)
    await api.stop()
  },
  userDataDir: async ({}, use) => {
    const directory = await mkdtemp(path.join(tmpdir(), 'imagecreator-e2e-'))
    await use(directory)
    await rm(directory, { recursive: true, force: true })
  },
  app: async ({ userDataDir, appArgs }, use) => {
    const app = await launchApp(userDataDir, appArgs)
    await use(app)
    await app.close()
  },
  window: async ({ app }, use) => {
    await use(await app.firstWindow())
  },
  relaunch: async ({ app, userDataDir, appArgs }, use) => {
    let current = app
    await use(async () => {
      await current.close()
      current = await launchApp(userDataDir, appArgs)

      return { app: current, window: await current.firstWindow() }
    })

    await current.close()
  },
})

export { expect } from '@playwright/test'
