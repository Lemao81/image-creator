import path from 'node:path'
import type { Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { generate, openMainView } from './generation-helpers'
import { imageInfo } from './image-helpers'
import { heightField, widthField } from './output-size-helpers'
import { stubSaveDialog } from './save-dialog-helpers'
import { storedSetting } from './settings-helpers'

const prompt = 'A watercolour fox in a snowy forest'
const sizeError = 'Enter a whole number from 1 to 4096'

async function previewAspectRatio(window: Page): Promise<number | null> {
  const box = await window.getByRole('img', { name: prompt }).boundingBox()

  return box && box.width / box.height
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

for (const [model, width, height, size] of [
  ['gpt-image-1', '1024', '1024', '1024x1024'],
  ['gpt-image-1', '512', '256', '1536x1024'],
  ['gpt-image-1-mini', '256', '512', '1024x1536'],
  ['dall-e-3', '1920', '1080', '1792x1024'],
  ['dall-e-3', '300', '400', '1024x1792'],
  ['dall-e-2', '128', '128', '256x256'],
  ['dall-e-2', '300', '200', '512x512'],
  ['dall-e-2', '2048', '2048', '1024x1024'],
  ['my-image-model', '512', '256', '1024x1024'],
]) {
  test(`generation size for ${model} at ${width}x${height}`, async ({ window, fakeImageApi }) => {
    await openMainView(window, fakeImageApi, model)
    await widthField(window).fill(width)
    await heightField(window).fill(height)

    await generate(window, prompt)

    expect(fakeImageApi.generationRequests).toMatchObject([{ body: { model, size } }])
  })
}

for (const [width, height] of [
  ['1024', '1024'],
  ['512', '256'],
  ['300', '200'],
  ['16', '16'],
  ['2048', '1536'],
]) {
  test(`accept writes the output size ${width}x${height}`, async ({
    app,
    window,
    fakeImageApi,
    userDataDir,
  }) => {
    const filePath = path.join(userDataDir, 'accepted.png')
    await stubSaveDialog(app, filePath)
    await openMainView(window, fakeImageApi, 'gpt-image-1')
    await generate(window, prompt)
    await widthField(window).fill(width)
    await heightField(window).fill(height)

    await window.getByRole('button', { name: 'Accept' }).click()

    await expect
      .poll(() => imageInfo(filePath))
      .toEqual({ format: 'png', width: Number(width), height: Number(height) })
  })
}

test('preview cropped to output size', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await generate(window, prompt)
  await expect.poll(() => previewAspectRatio(window)).toBeCloseTo(1)

  await widthField(window).fill('512')
  await heightField(window).fill('256')
  await expect.poll(() => previewAspectRatio(window)).toBeCloseTo(2)

  await heightField(window).fill('1024')
  await expect.poll(() => previewAspectRatio(window)).toBeCloseTo(0.5)
})

test('upscaling warning', async ({ window, fakeImageApi }) => {
  const warning = window.getByText('Output will be upscaled')
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await generate(window, prompt)
  await expect(warning).toBeHidden()

  await heightField(window).fill('1100')
  await expect(warning).toBeVisible()

  await widthField(window).fill('2048')
  await expect(warning).toBeVisible()

  await widthField(window).fill('16')
  await expect(warning).toBeHidden()
})

test('invalid output size blocks generate', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await window.getByLabel('Prompt').fill(prompt)

  await widthField(window).fill('0')
  await expect(window.getByRole('button', { name: 'Generate' })).toBeDisabled()

  await widthField(window).fill('512')
  await expect(window.getByRole('button', { name: 'Generate' })).toBeEnabled()
})

test('output size restored', async ({ window, fakeImageApi, userDataDir, relaunch }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await widthField(window).fill('512')
  await heightField(window).fill('256')
  await expect
    .poll(() => storedSetting(userDataDir, 'outputSize'))
    .toEqual({ width: 512, height: 256 })

  const { window: relaunched } = await relaunch()
  await expect(widthField(relaunched)).toHaveValue('512')
  await expect(heightField(relaunched)).toHaveValue('256')
})
