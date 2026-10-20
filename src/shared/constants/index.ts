export const IpcChannel = {
  loadProviderSettings: 'provider-settings:load',
  saveProviderSettings: 'provider-settings:save',
  testConnection: 'provider-settings:test-connection',
  generate: 'generation:start',
  accept: 'candidate:accept',
} as const
