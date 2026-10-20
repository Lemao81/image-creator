import { createOpenAiCompatibleProvider } from '#/providers/openai-compatible'
import type { ConnectionTestResult, ProviderSettingsUpdate } from '~/types'
import { loadStoredApiKey } from './settings-store'

function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error)
  }

  return error.cause instanceof Error ? `${error.message}: ${error.cause.message}` : error.message
}

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
