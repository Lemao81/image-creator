import { createOpenAiCompatibleProvider } from '#/providers/openai-compatible'
import { errorMessage } from '#/utils/helpers'
import type { ConnectionTestResult, ProviderSettingsUpdate } from '~/types'
import { loadStoredApiKey } from './settings-store'

export async function testConnection(
  update: ProviderSettingsUpdate,
): Promise<ConnectionTestResult> {
  try {
    const apiKey = update.apiKey || (await loadStoredApiKey())
    await createOpenAiCompatibleProvider({ ...update, apiKey }).testConnection()

    return { ok: true }
  } catch (error) {
    return { ok: false, message: errorMessage(error) }
  }
}
