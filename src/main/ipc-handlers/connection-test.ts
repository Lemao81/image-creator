import { resolveProvider } from '#/providers'
import { errorMessage } from '#/utils/helpers'
import type { ConnectionTestResult, ProviderSettingsUpdate } from '~/types'
import { loadStoredApiKey } from './settings-store'

export async function testConnection(
  update: ProviderSettingsUpdate,
  fakeProvider: boolean,
): Promise<ConnectionTestResult> {
  try {
    const provider = await resolveProvider(fakeProvider, async () => ({
      ...update,
      apiKey: update.apiKey || (await loadStoredApiKey()),
    }))

    await provider.testConnection()

    return { ok: true }
  } catch (error) {
    return { ok: false, message: errorMessage(error) }
  }
}
