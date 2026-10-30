import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { generate, openMainView } from './generation-helpers'

const prompt = 'A watercolour fox in a snowy forest'
const sizeError = 'Enter a whole number from 1 to 4096'

function widthField(window: Page): Locator {
  return window.getByLabel('Width', { exact: true })
}

function heightField(window: Page): Locator {
  return window.getByLabel('Height', { exact: true })
}

async function storedOutputSize(userDataDir: string): Promise<unknown> {
  const file = await readFile(path.join(userDataDir, 'settings.json'), 'utf8')

  return (JSON.parse(file) as { outputSize?: unknown }).outputSize
}

test('default output size', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')

  await expect(widthField(window)).toHaveValue('1024')
  await expect(heightField(window)).toHaveValue('1024')
})

test('output size presets ignore the typed value', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await widthField(window).fill('51')

  await window.getByRole('button', { name: 'Width presets' }).click()

  await expect(window.getByRole('menuitemradio')).toHaveText([
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

test('output size preset chosen', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')

  await window.getByRole('button', { name: 'Width presets' }).click()
  await expect(window.getByRole('menuitemradio', { name: '1024' })).toBeChecked()
  await window.getByRole('menuitemradio', { name: '256' }).click()
  await expect(window.getByRole('menu')).toBeHidden()
  await expect(widthField(window)).toHaveValue('256')
  await expect(heightField(window)).toHaveValue('256')

  await window.getByRole('button', { name: 'Height presets' }).click()
  await window.getByRole('menuitemradio', { name: '128' }).click()
  await expect(widthField(window)).toHaveValue('256')
  await expect(heightField(window)).toHaveValue('128')
})

test('width sets height', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')

  await widthField(window).fill('512')
  await expect(heightField(window)).toHaveValue('512')

  await heightField(window).fill('300')
  await expect(widthField(window)).toHaveValue('512')
  await expect(heightField(window)).toHaveValue('300')

  await widthField(window).fill('640')
  await expect(heightField(window)).toHaveValue('640')
})

for (const value of ['0', '4097', '12.5', 'abc', '']) {
  test(`invalid output size "${value}" blocks accept`, async ({ window, fakeImageApi }) => {
    await openMainView(window, fakeImageApi, 'gpt-image-1')
    await generate(window, prompt)

    await heightField(window).fill(value)
    await expect(heightField(window)).toHaveAttribute('aria-invalid', 'true')
    await expect(window.getByRole('alert')).toHaveText(sizeError)
    await expect(window.getByRole('button', { name: 'Accept' })).toBeDisabled()

    await heightField(window).fill('4096')
    await expect(window.getByRole('alert')).toBeHidden()
    await expect(window.getByRole('button', { name: 'Accept' })).toBeEnabled()
  })
}

test('output size restored', async ({ window, fakeImageApi, userDataDir, relaunch }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await widthField(window).fill('512')
  await heightField(window).fill('256')
  await expect.poll(() => storedOutputSize(userDataDir)).toEqual({ width: 512, height: 256 })

  const { window: relaunched } = await relaunch()
  await expect(widthField(relaunched)).toHaveValue('512')
  await expect(heightField(relaunched)).toHaveValue('256')
})
