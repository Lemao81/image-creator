import type { Locator, Page } from '@playwright/test'
import { expect, test } from './fixtures'
import { generate, openMainView } from './generation-helpers'
import { storedSetting } from './settings-helpers'

const prompt = 'A paper lantern floating at night'

function transparentBackground(window: Page): Locator {
  return window.getByRole('checkbox', { name: 'Transparent background' })
}

test('background option sent', async ({ window, fakeImageApi }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await expect(transparentBackground(window)).not.toBeChecked()
  await generate(window, prompt)

  await transparentBackground(window).check()
  await generate(window, prompt)

  const [opaqueRequest, transparentRequest] = fakeImageApi.generationRequests
  expect(opaqueRequest.body).not.toHaveProperty('background')
  expect(transparentRequest.body).toMatchObject({ background: 'transparent' })
})

test('transparent background restored', async ({ window, fakeImageApi, userDataDir, relaunch }) => {
  await openMainView(window, fakeImageApi, 'gpt-image-1')
  await transparentBackground(window).check()
  await expect.poll(() => storedSetting(userDataDir, 'transparentBackground')).toBe(true)

  const { window: relaunched } = await relaunch()
  await expect(transparentBackground(relaunched)).toBeChecked()
})
