import type { OutputSize } from '~/types'

export const IpcChannel = {
  loadProviderSettings: 'provider-settings:load',
  saveProviderSettings: 'provider-settings:save',
  testConnection: 'provider-settings:test-connection',
  generate: 'generation:start',
  cancelGeneration: 'generation:cancel',
  accept: 'candidate:accept',
  isFakeProvider: 'app:is-fake-provider',
  loadOutputSize: 'output-size:load',
  storeOutputSize: 'output-size:store',
} as const

export const outputSizePresets = [16, 32, 48, 64, 128, 256, 512, 768, 1024, 1536, 2048]

export const maxOutputSize = 4096

export const defaultOutputSize: OutputSize = { width: 1024, height: 1024 }
