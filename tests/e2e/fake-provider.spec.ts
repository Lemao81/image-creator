import { unreachableBaseUrl } from './fake-image-api'
import { expect, test } from './fixtures'
import { saveSettings } from './settings-helpers'

const prompt = 'A watercolour fox in a snowy forest'
const otherPrompt = 'A pencil sketch of a lighthouse at dusk'

test.use({ appArgs: ['--fake-provider'] })

test('generation with the fake provider ignores the settings', async ({ window }) => {
  await saveSettings(window, { baseUrl: await unreachableBaseUrl(), apiKey: 'x', model: 'x' })
  await window.getByRole('button', { name: 'Back' }).click()
  await expect(window.getByText('Fake Provider')).toBeVisible()

  await window.getByLabel('Prompt').fill(prompt)
  await window.getByRole('button', { name: 'Generate' }).click()
  await expect(window.getByRole('img', { name: prompt })).toBeVisible()

  await window.getByLabel('Prompt').fill(otherPrompt)
  await window.getByRole('button', { name: 'Generate' }).click()
  await expect(window.getByRole('img', { name: otherPrompt })).toBeVisible()
})

test('test connection with the fake provider always works', async ({ window }) => {
  await window.getByLabel('Base URL').fill(await unreachableBaseUrl())
  await window.getByRole('button', { name: 'Test connection' }).click()

  await expect(window.getByRole('alert')).toHaveText('Connection works')
})
