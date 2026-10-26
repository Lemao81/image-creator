import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from './fixtures'
import { openSettings, type SettingsInput, saveSettings } from './settings-helpers'

const settings: SettingsInput = {
  baseUrl: 'https://images.example.test/v1',
  apiKey: 'sk-test-secret',
  model: 'gpt-image-1',
}

test('first run opens settings', async ({ window }) => {
  await expect(window.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await expect(window.getByText('No API key set')).toBeVisible()
})

test('settings navigation', async ({ window }) => {
  await window.getByRole('button', { name: 'Back' }).click()
  await expect(window.getByRole('button', { name: 'Settings' })).toBeVisible()

  await openSettings(window)
  await expect(window.getByRole('heading', { name: 'Settings' })).toBeVisible()
})

test('settings restored', async ({ window, relaunch }) => {
  await saveSettings(window, settings)

  const { window: relaunched } = await relaunch()
  await openSettings(relaunched)
  await expect(relaunched.getByLabel('Base URL')).toHaveValue(settings.baseUrl)
  await expect(relaunched.getByLabel('Model')).toHaveValue(settings.model)
  await expect(relaunched.getByLabel('API key')).toHaveValue('')
  await expect(relaunched.getByText('An API key is set')).toBeVisible()
})

test('encrypted api key', async ({ window, userDataDir }) => {
  await saveSettings(window, settings)

  const file = await readFile(path.join(userDataDir, 'settings.json'), 'utf8')
  expect(file).toContain(settings.baseUrl)
  expect(file).not.toContain(settings.apiKey)
})

test('empty api key kept', async ({ window, relaunch }) => {
  await saveSettings(window, settings)
  await saveSettings(window, { ...settings, apiKey: '', model: 'dall-e-3' })

  const { window: relaunched } = await relaunch()
  await openSettings(relaunched)
  await expect(relaunched.getByLabel('Model')).toHaveValue('dall-e-3')
  await expect(relaunched.getByText('An API key is set')).toBeVisible()
})
