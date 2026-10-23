export function endpoint(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}${path}`
}

export function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error)
  }

  return error.cause instanceof Error ? `${error.message}: ${error.cause.message}` : error.message
}
