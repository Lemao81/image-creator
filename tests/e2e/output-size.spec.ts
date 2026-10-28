import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { expect, test } from './fixtures'
import { generate, openMainView } from './generation-helpers'

const prompt = 'A watercolour fox in a snowy forest'
const sizeError = 'Enter a whole number from 1 to 4096'

async function storedOutputSize(userDataDir: string): Promise<unknown> {
  const file = await readFile(path.join(userDataDir, 'settings.json'), 'utf8')

  return (JSON.parse(file) as { outputSize?: unknown }).outputSize
}

test('default output size', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')

  await expect(window.getByLabel('Width')).toHaveValue('1024')
  await expect(window.getByLabel('Height')).toHaveValue('1024')
})

test('output size presets', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')

  const presets = await window
    .locator('#output-size-presets option')
    .evaluateAll((options) => options.map((o) => (o as HTMLOptionElement).value))

  expect(presets).toEqual([
    '16',
    '32',
    '48',
    '64',
    '128',
    '256',
    '512',
    '768',
    '1024',
    '1536',
    '2048',
  ])
})

test('width sets height', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')

  await window.getByLabel('Width').fill('512')
  await expect(window.getByLabel('Height')).toHaveValue('512')

  await window.getByLabel('Height').fill('300')
  await expect(window.getByLabel('Width')).toHaveValue('512')
  await expect(window.getByLabel('Height')).toHaveValue('300')

  await window.getByLabel('Width').fill('640')
  await expect(window.getByLabel('Height')).toHaveValue('640')
})

for (const value of ['0', '4097', '12.5', 'abc', '']) {
  test(`invalid output size "${value}" blocks accept`, async ({ window, fakeImageApi }) => {
    await openMainView(window, fakeImageApi, 'gpt-image-1')
    await generate(window, prompt)

    await window.getByLabel('Height').fill(value)
    await expect(window.getByLabel('Height')).toHaveAttribute('aria-invalid', 'true')
    await expect(window.getByRole('alert')).toHaveText(sizeError)
    await expect(window.getByRole('button', { name: 'Accept' })).toBeDisabled()

    await window.getByLabel('Height').fill('4096')
    await expect(window.getByRole('alert')).toBeHidden()
    await expect(window.getByRole('button', { name: 'Accept' })).toBeEnabled()
  })
}

test('output size restored', async ({ window, fakeImageApi, userDataDir, relaunch }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await window.getByLabel('Width').fill('512')
  await window.getByLabel('Height').fill('256')
  await expect.poll(() => storedOutputSize(userDataDir)).toEqual({ width: 512, height: 256 })

  const { window: relaunched } = await relaunch()
  await expect(relaunched.getByLabel('Width')).toHaveValue('512')
  await expect(relaunched.getByLabel('Height')).toHaveValue('256')
})
