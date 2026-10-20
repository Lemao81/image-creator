import type { Page } from '@playwright/test'
import { expect } from './fixtures'

export type SettingsInput = {
  baseUrl: string
  apiKey: string
  model: string
}

export async function openSettings(window: Page): Promise<void> {
  await window.getByRole('button', { name: 'Settings' }).click()
}

export async function fillSettings(
  window: Page,
  { baseUrl, apiKey, model }: SettingsInput,
): Promise<void> {
  await window.getByLabel('Base URL').fill(baseUrl)
  await window.getByLabel('API key').fill(apiKey)
  await window.getByLabel('Model').fill(model)
}

export async function saveSettings(window: Page, settings: SettingsInput): Promise<void> {
  await fillSettings(window, settings)
  await window.getByRole('button', { name: 'Save' }).click()
  await expect(window.getByRole('status')).toHaveText('Saved')
}
