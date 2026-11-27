import type { Locator, Page } from '@playwright/test'

export function widthField(window: Page): Locator {
  return window.getByLabel('Width', { exact: true })
}

export function heightField(window: Page): Locator {
  return window.getByLabel('Height', { exact: true })
}
