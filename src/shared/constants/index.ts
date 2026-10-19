export const IpcChannel = {
  loadProviderSettings: 'provider-settings:load',
  saveProviderSettings: 'provider-settings:save',
  generate: 'generation:start',
  accept: 'candidate:accept',
} as const
