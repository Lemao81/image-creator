import type { AddressInfo } from 'node:net'
import { createServer } from 'node:net'
import { fakeApiKey } from './fake-image-api'
import { expect, test } from './fixtures'
import { fillSettings, saveSettings } from './settings-helpers'

const model = 'gpt-image-1'

async function unreachableBaseUrl(): Promise<string> {
  const server = createServer()
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address() as AddressInfo
  await new Promise<void>((resolve) => server.close(() => resolve()))

  return `http://127.0.0.1:${port}`
}

test('test connection without saving', async ({ window, fakeImageApi }) => {
  await fillSettings(window, { baseUrl: fakeImageApi.baseUrl, apiKey: fakeApiKey, model })
  await window.getByRole('button', { name: 'Test connection' }).click()

  await expect(window.getByRole('alert')).toHaveText('Connection works')
})

test('test connection with the stored key', async ({ window, fakeImageApi }) => {
  await saveSettings(window, { baseUrl: fakeImageApi.baseUrl, apiKey: fakeApiKey, model })
  await expect(window.getByLabel('API key')).toHaveValue('')
  await window.getByRole('button', { name: 'Test connection' }).click()

  await expect(window.getByRole('alert')).toHaveText('Connection works')
})

test('test connection with a wrong key', async ({ window, fakeImageApi }) => {
  await fillSettings(window, { baseUrl: fakeImageApi.baseUrl, apiKey: 'sk-wrong', model })
  await window.getByRole('button', { name: 'Test connection' }).click()

  const alert = window.getByRole('alert')
  await expect(alert).toContainText('Connection failed')
  await expect(alert).toContainText('401')
  await expect(alert).toContainText('Incorrect API key provided')
})

test('test connection with an unreachable url', async ({ window }) => {
  await fillSettings(window, { baseUrl: await unreachableBaseUrl(), apiKey: fakeApiKey, model })
  await window.getByRole('button', { name: 'Test connection' }).click()

  const alert = window.getByRole('alert')
  await expect(alert).toContainText('Connection failed')
  await expect(alert).toContainText('ECONNREFUSED')
})
