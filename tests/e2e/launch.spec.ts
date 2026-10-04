import { expect, test } from './fixtures'

test('main view', async ({ window }) => {
  await expect(window.getByRole('main')).toBeAttached()
})
