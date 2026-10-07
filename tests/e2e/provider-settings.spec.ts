import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'

type SettingsInput = {
  baseUrl: string
  apiKey: string
  model: string
}

const settings: SettingsInput = {
  baseUrl: 'https://images.example.test/v1',
  apiKey: 'sk-test-secret',
  model: 'gpt-image-1',
}

async function openSettings(window: Page): Promise<void> {
  await window.getByRole('button', { name: 'Settings' }).click()
}

async function saveSettings(
  window: Page,
  { baseUrl, apiKey, model }: SettingsInput,
): Promise<void> {
  await window.getByLabel('Base URL').fill(baseUrl)
  await window.getByLabel('API key').fill(apiKey)
  await window.getByLabel('Model').fill(model)
  await window.getByRole('button', { name: 'Save' }).click()
  await expect(window.getByRole('status')).toHaveText('Saved')
}

test('settings navigation', async ({ window }) => {
  await openSettings(window)
  await expect(window.getByRole('heading', { name: 'Settings' })).toBeVisible()
  await expect(window.getByText('No API key set')).toBeVisible()

  await window.getByRole('button', { name: 'Back' }).click()
  await expect(window.getByRole('button', { name: 'Settings' })).toBeVisible()
})

test('settings restored', async ({ window, relaunch }) => {
  await openSettings(window)
  await saveSettings(window, settings)

  const relaunched = await relaunch()
  await openSettings(relaunched)
  await expect(relaunched.getByLabel('Base URL')).toHaveValue(settings.baseUrl)
  await expect(relaunched.getByLabel('Model')).toHaveValue(settings.model)
  await expect(relaunched.getByLabel('API key')).toHaveValue('')
  await expect(relaunched.getByText('An API key is set')).toBeVisible()
})

test('encrypted api key', async ({ window, userDataDir }) => {
  await openSettings(window)
  await saveSettings(window, settings)

  const file = await readFile(path.join(userDataDir, 'settings.json'), 'utf8')
  expect(file).toContain(settings.baseUrl)
  expect(file).not.toContain(settings.apiKey)
})

test('empty api key kept', async ({ window, relaunch }) => {
  await openSettings(window)
  await saveSettings(window, settings)
  await saveSettings(window, { ...settings, apiKey: '', model: 'dall-e-3' })

  const relaunched = await relaunch()
  await openSettings(relaunched)
  await expect(relaunched.getByLabel('Model')).toHaveValue('dall-e-3')
  await expect(relaunched.getByText('An API key is set')).toBeVisible()
})
