import { readFile } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { type AddressInfo, createServer as createNetServer } from 'node:net'
import path from 'node:path'
import { json } from 'node:stream/consumers'

export type GenerationRequest = {
  authorization: string | undefined
  body: Record<string, unknown>
}

export type FakeImageApi = {
  baseUrl: string
  generationRequests: GenerationRequest[]
  abortedGenerationRequests: GenerationRequest[]
  holdGenerations: () => () => void
  failNextGeneration: (status: number, message: string) => void
  stop: () => Promise<void>
}

const fixtureImageNames = ['candidate.png', 'other-candidate.png']

export const fixtureImagePaths = fixtureImageNames.map((n) =>
  path.join(__dirname, 'fixture-images', n),
)

export const fakeApiKey = 'sk-test'

export async function unreachableBaseUrl(): Promise<string> {
  const server = createNetServer()
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address() as AddressInfo
  await new Promise<void>((resolve) => server.close(() => resolve()))

  return `http://127.0.0.1:${port}`
}

function sendJson(response: ServerResponse, body: unknown, status = 200): void {
  response.writeHead(status, { 'Content-Type': 'application/json' }).end(JSON.stringify(body))
}

export async function startFakeImageApi(): Promise<FakeImageApi> {
  const fixtureImages = await Promise.all(fixtureImagePaths.map((p) => readFile(p)))
  const generationRequests: GenerationRequest[] = []
  const abortedGenerationRequests: GenerationRequest[] = []
  let heldGenerations: Promise<void> | null = null
  let nextGenerationFailure: { status: number; message: string } | null = null

  async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    if (request.method === 'POST' && request.url === '/images/generations') {
      const body = (await json(request)) as Record<string, unknown>
      const generationRequest = { authorization: request.headers.authorization, body }
      const fixtureIndex = generationRequests.length % fixtureImages.length
      generationRequests.push(generationRequest)
      response.on('close', () => {
        if (!response.writableFinished) {
          abortedGenerationRequests.push(generationRequest)
        }
      })

      await heldGenerations
      if (response.destroyed) {
        return
      }

      if (nextGenerationFailure) {
        const { status, message } = nextGenerationFailure
        nextGenerationFailure = null
        sendJson(response, { error: { message } }, status)

        return
      }

      const image = String(body.model).startsWith('dall-e')
        ? { url: `${baseUrl}/files/${fixtureImageNames[fixtureIndex]}` }
        : { b64_json: fixtureImages[fixtureIndex].toString('base64') }

      sendJson(response, { created: Math.floor(Date.now() / 1000), data: [image] })

      return
    }

    if (request.method === 'GET' && request.url === '/models') {
      if (request.headers.authorization !== `Bearer ${fakeApiKey}`) {
        sendJson(response, { error: { message: 'Incorrect API key provided' } }, 401)

        return
      }

      sendJson(response, { object: 'list', data: [{ id: 'gpt-image-1', object: 'model' }] })

      return
    }

    const fixtureImageIndex = fixtureImageNames.findIndex((n) => request.url === `/files/${n}`)
    if (request.method === 'GET' && fixtureImageIndex !== -1) {
      response.writeHead(200, { 'Content-Type': 'image/png' }).end(fixtureImages[fixtureImageIndex])

      return
    }

    response.writeHead(404).end()
  }

  const server = createServer((request, response) => {
    handle(request, response).catch(() => response.writeHead(500).end())
  })

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })

  const { port } = server.address() as AddressInfo
  const baseUrl = `http://127.0.0.1:${port}`

  return {
    baseUrl,
    generationRequests,
    abortedGenerationRequests,
    holdGenerations: () => {
      let release: (() => void) | undefined
      heldGenerations = new Promise((resolve) => {
        release = resolve
      })

      return () => {
        heldGenerations = null
        release?.()
      }
    },
    failNextGeneration: (status, message) => {
      nextGenerationFailure = { status, message }
    },
    stop: () =>
      new Promise((resolve, reject) => {
        server.closeAllConnections()
        server.close((error) => (error ? reject(error) : resolve()))
      }),
  }
}
