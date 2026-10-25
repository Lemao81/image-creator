export function endpoint(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}${path}`
}

export function errorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return String(error)
  }

  return error.cause instanceof Error ? `${error.message}: ${error.cause.message}` : error.message
}

const maxSlugLength = 50

export function filenameSlug(prompt: string): string {
  const words = prompt.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
  let slug = ''
  for (const word of words) {
    const extended = slug ? `${slug}-${word}` : word
    if (extended.length > maxSlugLength) {
      break
    }

    slug = extended
  }

  return slug || (words[0]?.slice(0, maxSlugLength) ?? 'candidate')
}
