import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { app, safeStorage } from 'electron'
import type { ProviderSettings, ProviderSettingsUpdate } from '../shared/types'
import type { DecryptedProviderSettings, StoredProviderSettings, StoredSettings } from './types'

function settingsFilePath(): string {
  return path.join(app.getPath('userData'), 'settings.json')
}

async function readSettings(): Promise<StoredSettings> {
  try {
    return JSON.parse(await readFile(settingsFilePath(), 'utf8')) as StoredSettings
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return {}
    }

    throw error
  }
}

async function writeSettings(settings: StoredSettings): Promise<void> {
  await writeFile(settingsFilePath(), JSON.stringify(settings, null, 2))
}

function encryptApiKey(apiKey: string): string {
  return safeStorage.encryptString(apiKey).toString('base64')
}

function decryptApiKey(encryptedApiKey: string): string {
  return safeStorage.decryptString(Buffer.from(encryptedApiKey, 'base64'))
}

function toProviderSettings(stored: StoredProviderSettings): ProviderSettings {
  return {
    baseUrl: stored.baseUrl,
    model: stored.model,
    hasApiKey: stored.encryptedApiKey !== undefined,
  }
}

export async function loadProviderSettings(): Promise<ProviderSettings | null> {
  const { provider } = await readSettings()

  return provider ? toProviderSettings(provider) : null
}

export async function loadDecryptedProviderSettings(): Promise<DecryptedProviderSettings> {
  const { provider } = await readSettings()
  if (!provider) {
    throw new Error('No Provider settings saved')
  }

  return {
    baseUrl: provider.baseUrl,
    model: provider.model,
    apiKey: provider.encryptedApiKey ? decryptApiKey(provider.encryptedApiKey) : '',
  }
}

export async function saveProviderSettings(
  update: ProviderSettingsUpdate,
): Promise<ProviderSettings> {
  const settings = await readSettings()
  const provider: StoredProviderSettings = {
    baseUrl: update.baseUrl,
    model: update.model,
    encryptedApiKey: update.apiKey
      ? encryptApiKey(update.apiKey)
      : settings.provider?.encryptedApiKey,
  }

  await writeSettings({ ...settings, provider })

  return toProviderSettings(provider)
}
