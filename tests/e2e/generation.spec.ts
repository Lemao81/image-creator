import { expect, test } from './fixtures'
import { saveSettings } from './settings-helpers'

const prompt = 'A watercolour fox in a snowy forest'

for (const model of ['gpt-image-1', 'dall-e-3']) {
  test(`generation with ${model}`, async ({ window, fakeImageApi }) => {
    await saveSettings(window, { baseUrl: fakeImageApi.baseUrl, apiKey: 'sk-test', model })
    await window.getByRole('button', { name: 'Back' }).click()
    await expect(window.getByText('No Candidate yet')).toBeVisible()

    await window.getByLabel('Prompt').fill(prompt)
    await window.getByRole('button', { name: 'Generate' }).click()

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
