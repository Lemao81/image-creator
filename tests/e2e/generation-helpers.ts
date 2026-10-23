import type { Page } from '@playwright/test'
import { type FakeImageApi, fakeApiKey } from './fake-image-api'
import { expect } from './fixtures'
import { saveSettings } from './settings-helpers'

export async function openMainView(
  window: Page,
  fakeImageApi: FakeImageApi,
  model: string,
): Promise<void> {
  await saveSettings(window, { baseUrl: fakeImageApi.baseUrl, apiKey: fakeApiKey, model })
  await window.getByRole('button', { name: 'Back' }).click()
  await expect(window.getByText('No Candidate yet')).toBeVisible()
}

export async function generate(window: Page, prompt: string): Promise<void> {
  await window.getByLabel('Prompt').fill(prompt)
  await window.getByRole('button', { name: 'Generate' }).click()
  await expect(window.getByRole('img', { name: prompt })).toBeVisible()
}
