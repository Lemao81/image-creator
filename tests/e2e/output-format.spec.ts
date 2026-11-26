import path from 'node:path'
import type { Locator, Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { generate, openMainView } from './generation-helpers'
import { imageInfo, pixelAt } from './image-helpers'
import { saveDialogOptions, stubSaveDialog } from './save-dialog-helpers'
import { storedSetting } from './settings-helpers'

const prompt = 'A watercolour fox in a snowy forest'
const slug = 'a-watercolour-fox-in-a-snowy-forest'

function formatField(window: Page): Locator {
  return window.getByRole('combobox', { name: 'Output format' })
}

async function chooseFormat(window: Page, label: string): Promise<void> {
  await formatField(window).click()
  await window.getByRole('option', { name: label }).click()
  await expect(formatField(window)).toContainText(label)
}

test('output format options', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await expect(formatField(window)).toContainText('PNG')

  await formatField(window).click()

  await expect(window.getByRole('option')).toHaveText(['PNG', 'JPEG', 'WebP'])
})

for (const [label, format, extension] of [
  ['PNG', 'png', 'png'],
  ['JPEG', 'jpeg', 'jpg'],
  ['WebP', 'webp', 'webp'],
]) {
  test(`accept writes ${label}`, async ({ app, window, fakeImageApi, userDataDir }) => {
    const filePath = path.join(userDataDir, `accepted.${extension}`)
    await stubSaveDialog(app, filePath)
    await openMainView(window, fakeImageApi, 'gpt-image-1')
    await generate(window, prompt)
    await chooseFormat(window, label)

    await window.getByRole('button', { name: 'Accept' }).click()

    await expect.poll(() => imageInfo(filePath)).toEqual({ format, width: 1024, height: 1024 })
    expect(await saveDialogOptions(app)).toMatchObject({
      defaultPath: `${slug}.${extension}`,
      filters: [{ extensions: [extension] }],
    })
  })
}

test('jpeg flattens transparency', async ({ app, window, fakeImageApi, userDataDir }) => {
  const filePath = path.join(userDataDir, 'accepted.jpg')
  await stubSaveDialog(app, filePath)
  fakeImageApi.serveTransparentImages()
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await generate(window, prompt)
  await chooseFormat(window, 'JPEG')

  await window.getByRole('button', { name: 'Accept' }).click()

  await expect.poll(() => imageInfo(filePath)).toMatchObject({ format: 'jpeg' })
  const [red, green, blue] = await pixelAt(filePath, 512, 512)
  expect(Math.min(...(await pixelAt(filePath, 16, 16)))).toBeGreaterThanOrEqual(250)
  expect(Math.max(red, green)).toBeLessThan(120)
  expect(blue).toBeGreaterThan(160)
})

test('jpeg transparency hint', async ({ window, fakeImageApi }) => {
  const hint = window.getByText('JPEG has no transparency')
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await generate(window, prompt)
  await chooseFormat(window, 'JPEG')
  await expect(hint).toBeHidden()

  fakeImageApi.serveTransparentImages()
  await generate(window, 'A glass marble on nothing')
  await expect(hint).toBeVisible()

  await chooseFormat(window, 'PNG')
  await expect(hint).toBeHidden()

  await chooseFormat(window, 'JPEG')
  await window.keyboard.press('ArrowLeft')
  await expect(window.getByRole('img', { name: prompt })).toBeVisible()
  await expect(hint).toBeHidden()
})

test('output format restored', async ({ window, fakeImageApi, userDataDir, relaunch }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await chooseFormat(window, 'WebP')
  await expect.poll(() => storedSetting(userDataDir, 'outputFormat')).toBe('webp')

  const { window: relaunched } = await relaunch()
  await expect(formatField(relaunched)).toContainText('WebP')
})
