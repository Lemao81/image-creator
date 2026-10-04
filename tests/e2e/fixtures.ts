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

type Fixtures = {
  fakeImageApi: FakeImageApi
  userDataDir: string
  app: ElectronApplication
  window: Page
}

const appRoot = path.join(__dirname, '..', '..')

export const test = base.extend<Fixtures>({
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
  app: async ({ userDataDir }, use) => {
    const app = await electron.launch({ args: [appRoot, `--user-data-dir=${userDataDir}`] })
    await use(app)
    await app.close()
  },
  window: async ({ app }, use) => {
    await use(await app.firstWindow())
  },
})

export { expect } from '@playwright/test'
