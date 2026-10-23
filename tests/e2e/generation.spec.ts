import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Page } from '@playwright/test'
import {
  type FakeImageApi,
  fakeApiKey,
  fixtureImagePaths,
  unreachableBaseUrl,
} from './fake-image-api'
import { expect, test } from './fixtures'
import { generate, openMainView } from './generation-helpers'
import { saveDialogShown, stubSaveDialog } from './save-dialog-helpers'
import { saveSettings } from './settings-helpers'

const prompt = 'A watercolour fox in a snowy forest'
const otherPrompt = 'A pencil sketch of a lighthouse at dusk'

async function generateCandidate(
  window: Page,
  fakeImageApi: FakeImageApi,
  model: string,
): Promise<void> {
  await openMainView(window, fakeImageApi, model)
  await generate(window, prompt)
}

for (const model of ['gpt-image-1', 'dall-e-3']) {
  test(`generation with ${model}`, async ({ window, fakeImageApi }) => {
    await generateCandidate(window, fakeImageApi, model)

    const preview = window.getByRole('img', { name: prompt })
    await expect(preview).toHaveJSProperty('naturalWidth', 1024)
    await expect(preview).toHaveJSProperty('naturalHeight', 1024)
    expect(fakeImageApi.generationRequests).toMatchObject([
      { authorization: `Bearer ${fakeApiKey}`, body: { model, prompt } },
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

  const fixtureImage = await readFile(fixtureImagePaths[0])
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

test('running generation shows progress', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  const release = fakeImageApi.holdGenerations()

  await window.getByLabel('Prompt').fill(prompt)
  await window.getByRole('button', { name: 'Generate' }).click()

  const progress = window.getByRole('status')
  await expect(progress).toContainText('Generating… 0 s')
  await expect(progress).toContainText('Generating… 1 s')
  await expect(window.getByRole('button', { name: 'Generate' })).toBeDisabled()
  await window.getByLabel('Prompt').fill(otherPrompt)
  await expect(window.getByLabel('Prompt')).toHaveValue(otherPrompt)

  release()

  await expect(window.getByRole('img', { name: prompt })).toBeVisible()
  await expect(progress).toBeHidden()
  await expect(window.getByRole('button', { name: 'Cancel' })).toBeHidden()
  await expect(window.getByRole('button', { name: 'Generate' })).toBeEnabled()
})

test('ctrl+enter starts a generation', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  const promptInput = window.getByLabel('Prompt')

  await promptInput.press('Control+Enter')
  await expect(window.getByRole('status')).toBeHidden()

  const release = fakeImageApi.holdGenerations()
  await promptInput.fill(prompt)
  await promptInput.press('Control+Enter')

  await expect(window.getByRole('status')).toBeVisible()
  await expect(promptInput).toHaveValue(prompt)
  await promptInput.press('Control+Enter')

  release()

  await expect(window.getByRole('img', { name: prompt })).toBeVisible()
  expect(fakeImageApi.generationRequests).toMatchObject([{ body: { prompt } }])
})

test('cancel keeps the preview', async ({ window, fakeImageApi }) => {
  await generateCandidate(window, fakeImageApi, 'gpt-image-1')
  const release = fakeImageApi.holdGenerations()

  await window.getByLabel('Prompt').fill(otherPrompt)
  await window.getByRole('button', { name: 'Generate' }).click()
  await expect(window.getByRole('status')).toBeVisible()
  await window.getByRole('button', { name: 'Cancel' }).click()

  await expect(window.getByRole('status')).toBeHidden()
  await expect(window.getByRole('button', { name: 'Generate' })).toBeEnabled()
  await expect
    .poll(() => fakeImageApi.abortedGenerationRequests)
    .toMatchObject([{ body: { prompt: otherPrompt } }])

  release()

  await expect(window.getByRole('img', { name: prompt })).toBeVisible()
  await expect(window.getByRole('img', { name: otherPrompt })).toBeHidden()
})

test('api error shows the banner until the next generation', async ({ window, fakeImageApi }) => {
  await generateCandidate(window, fakeImageApi, 'gpt-image-1')
  fakeImageApi.failNextGeneration(400, 'Your request was rejected by the safety system')

  await window.getByLabel('Prompt').fill(otherPrompt)
  await window.getByRole('button', { name: 'Generate' }).click()

  const banner = window.getByRole('alert')
  await expect(banner).toContainText('Generation failed')
  await expect(banner).toContainText('400')
  await expect(banner).toContainText('Your request was rejected by the safety system')
  await expect(window.getByRole('img', { name: prompt })).toBeVisible()
  await expect(window.getByRole('button', { name: 'Generate' })).toBeEnabled()

  const release = fakeImageApi.holdGenerations()
  await window.getByRole('button', { name: 'Generate' }).click()

  await expect(window.getByRole('status')).toBeVisible()
  await expect(banner).toBeHidden()

  release()

  await expect(window.getByRole('img', { name: otherPrompt })).toBeVisible()
  await expect(banner).toBeHidden()
})

test('network error shows the banner', async ({ window }) => {
  await saveSettings(window, {
    baseUrl: await unreachableBaseUrl(),
    apiKey: fakeApiKey,
    model: 'gpt-image-1',
  })

  await window.getByRole('button', { name: 'Back' }).click()

  await window.getByLabel('Prompt').fill(prompt)
  await window.getByRole('button', { name: 'Generate' }).click()

  const banner = window.getByRole('alert')
  await expect(banner).toContainText('Generation failed')
  await expect(banner).toContainText('ECONNREFUSED')
  await expect(window.getByText('No Candidate yet')).toBeVisible()
})
