import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { type FakeImageApi, fixtureImagePaths } from './fake-image-api'
import { expect, test } from './fixtures'
import { generate, openMainView } from './generation-helpers'
import { stubSaveDialog } from './save-dialog-helpers'

const firstPrompt = 'A watercolour fox in a snowy forest'
const secondPrompt = 'A pencil sketch of a lighthouse at dusk'

async function generateTwoCandidates(window: Page, fakeImageApi: FakeImageApi): Promise<void> {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await generate(window, firstPrompt)
  await generate(window, secondPrompt)
}

function caption(window: Page, prompt: string): Locator {
  return window.getByRole('paragraph').filter({ hasText: prompt })
}

test('new candidates are appended and shown', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  const previous = window.getByRole('button', { name: 'Previous Candidate' })
  const next = window.getByRole('button', { name: 'Next Candidate' })

  await generate(window, firstPrompt)
  await expect(window.getByText('1 / 1')).toBeVisible()
  await expect(previous).toBeDisabled()
  await expect(next).toBeDisabled()

  await generate(window, secondPrompt)
  await expect(window.getByText('2 / 2')).toBeVisible()
  await expect(window.getByRole('img', { name: firstPrompt })).toBeHidden()
  await expect(previous).toBeEnabled()
  await expect(next).toBeDisabled()
})

test('previous and next navigate the candidates', async ({ window, fakeImageApi }) => {
  await generateTwoCandidates(window, fakeImageApi)
  const previous = window.getByRole('button', { name: 'Previous Candidate' })
  const next = window.getByRole('button', { name: 'Next Candidate' })

  await previous.click()
  await expect(window.getByRole('img', { name: firstPrompt })).toBeVisible()
  await expect(window.getByText('1 / 2')).toBeVisible()
  await expect(previous).toBeDisabled()
  await expect(next).toBeEnabled()

  await next.click()
  await expect(window.getByRole('img', { name: secondPrompt })).toBeVisible()
  await expect(window.getByText('2 / 2')).toBeVisible()
})

test('arrow keys navigate outside text fields', async ({ window, fakeImageApi }) => {
  await generateTwoCandidates(window, fakeImageApi)
  const promptInput = window.getByLabel('Prompt')

  await promptInput.press('ArrowLeft')
  await expect(window.getByText('2 / 2')).toBeVisible()

  await promptInput.blur()
  await window.keyboard.press('ArrowLeft')
  await expect(window.getByRole('img', { name: firstPrompt })).toBeVisible()
  await expect(window.getByText('1 / 2')).toBeVisible()

  await window.keyboard.press('ArrowLeft')
  await expect(window.getByText('1 / 2')).toBeVisible()

  await window.keyboard.press('ArrowRight')
  await expect(window.getByRole('img', { name: secondPrompt })).toBeVisible()
  await expect(window.getByText('2 / 2')).toBeVisible()
})

test('a new candidate is shown while browsing', async ({ window, fakeImageApi }) => {
  await generateTwoCandidates(window, fakeImageApi)
  await window.getByRole('button', { name: 'Previous Candidate' }).click()

  const thirdPrompt = 'An ink drawing of a heron'
  await generate(window, thirdPrompt)

  await expect(window.getByText('3 / 3')).toBeVisible()
})

test('the shown candidate has its prompt as caption', async ({ window, fakeImageApi }) => {
  await generateTwoCandidates(window, fakeImageApi)
  await expect(caption(window, secondPrompt)).toBeVisible()

  await window.getByRole('button', { name: 'Previous Candidate' }).click()

  await expect(caption(window, firstPrompt)).toBeVisible()
  await expect(caption(window, secondPrompt)).toBeHidden()
})

test('browsing leaves the prompt input unchanged', async ({ window, fakeImageApi }) => {
  await generateTwoCandidates(window, fakeImageApi)
  const promptInput = window.getByLabel('Prompt')
  await promptInput.fill('A draft prompt')

  await window.getByRole('button', { name: 'Previous Candidate' }).click()

  await expect(window.getByText('1 / 2')).toBeVisible()
  await expect(promptInput).toHaveValue('A draft prompt')
})

test('use this prompt replaces the prompt input', async ({ window, fakeImageApi }) => {
  await generateTwoCandidates(window, fakeImageApi)
  const promptInput = window.getByLabel('Prompt')
  await promptInput.fill('A draft prompt')
  await window.getByRole('button', { name: 'Previous Candidate' }).click()

  await window.getByRole('button', { name: 'Use this prompt' }).click()

  await expect(promptInput).toHaveValue(firstPrompt)
})

test('accept writes the shown candidate', async ({ app, window, fakeImageApi, userDataDir }) => {
  const filePath = path.join(userDataDir, 'accepted.png')
  await stubSaveDialog(app, filePath)
  await generateTwoCandidates(window, fakeImageApi)
  await window.getByRole('button', { name: 'Previous Candidate' }).click()

  await window.getByRole('button', { name: 'Accept' }).click()

  const firstImage = await readFile(fixtureImagePaths[0])
  await expect.poll(() => readFile(filePath).catch(() => null)).toEqual(firstImage)
  await expect(window.getByRole('img', { name: firstPrompt })).toBeVisible()
  await expect(window.getByText('1 / 2')).toBeVisible()
})
