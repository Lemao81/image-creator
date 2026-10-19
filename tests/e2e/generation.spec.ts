import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Page } from '@playwright/test'
import { type FakeImageApi, fixtureImagePath } from './fake-image-api'
import { expect, test } from './fixtures'
import { saveDialogShown, stubSaveDialog } from './save-dialog-helpers'
import { saveSettings } from './settings-helpers'

const prompt = 'A watercolour fox in a snowy forest'

async function generateCandidate(
  window: Page,
  fakeImageApi: FakeImageApi,
  model: string,
): Promise<void> {
  await saveSettings(window, { baseUrl: fakeImageApi.baseUrl, apiKey: 'sk-test', model })
  await window.getByRole('button', { name: 'Back' }).click()
  await expect(window.getByText('No Candidate yet')).toBeVisible()

  await window.getByLabel('Prompt').fill(prompt)
  await window.getByRole('button', { name: 'Generate' }).click()
  await expect(window.getByRole('img', { name: prompt })).toBeVisible()
}

for (const model of ['gpt-image-1', 'dall-e-3']) {
  test(`generation with ${model}`, async ({ window, fakeImageApi }) => {
    await generateCandidate(window, fakeImageApi, model)

    const preview = window.getByRole('img', { name: prompt })
    await expect(preview).toHaveJSProperty('naturalWidth', 1024)
    await expect(preview).toHaveJSProperty('naturalHeight', 1024)
    expect(fakeImageApi.generationRequests).toMatchObject([
      { authorization: 'Bearer sk-test', body: { model, prompt } },
    ])
  })
}

test('generate needs a prompt', async ({ window }) => {
  await window.getByRole('button', { name: 'Back' }).click()
  const generate = window.getByRole('button', { name: 'Generate' })
  await expect(generate).toBeDisabled()

  await window.getByLabel('Prompt').fill('   ')
  await expect(generate).toBeDisabled()

  await window.getByLabel('Prompt').fill(prompt)
  await expect(generate).toBeEnabled()
})

test('accept writes the candidate', async ({ app, window, fakeImageApi, userDataDir }) => {
  const filePath = path.join(userDataDir, 'accepted.png')
  await stubSaveDialog(app, filePath)
  await generateCandidate(window, fakeImageApi, 'gpt-image-1')

  await window.getByRole('button', { name: 'Accept' }).click()

  const fixtureImage = await readFile(fixtureImagePath)
  await expect.poll(() => readFile(filePath).catch(() => null)).toEqual(fixtureImage)
})

test('accept cancelled', async ({ app, window, fakeImageApi, userDataDir }) => {
  await stubSaveDialog(app, undefined)
  await generateCandidate(window, fakeImageApi, 'gpt-image-1')

  await window.getByRole('button', { name: 'Accept' }).click()

  await expect.poll(() => saveDialogShown(app)).toBe(true)
  const files = await readdir(userDataDir)
  expect(files.filter((f) => path.extname(f) === '.png')).toEqual([])
})
