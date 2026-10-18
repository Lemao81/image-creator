import { readFile } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import type { AddressInfo } from 'node:net'
import path from 'node:path'

export type GenerationRequest = {
  authorization: string | undefined
  body: Record<string, unknown>
}

export type FakeImageApi = {
  baseUrl: string
  generationRequests: GenerationRequest[]
  stop: () => Promise<void>
}

export const fixtureImagePath = path.join(__dirname, 'fixture-images', 'candidate.png')

const fixtureImageUrlPath = '/files/candidate.png'

async function readBody(request: IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of request) {
    chunks.push(chunk as Buffer)
  }

  return Buffer.concat(chunks).toString('utf8')
}

function sendJson(response: ServerResponse, body: unknown): void {
  response.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(body))
}

export async function startFakeImageApi(): Promise<FakeImageApi> {
  const fixtureImage = await readFile(fixtureImagePath)
  const generationRequests: GenerationRequest[] = []

  async function handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    if (request.method === 'POST' && request.url === '/images/generations') {
      const body = JSON.parse(await readBody(request)) as Record<string, unknown>
      generationRequests.push({ authorization: request.headers.authorization, body })
      const image = String(body.model).startsWith('dall-e')
        ? { url: `${baseUrl}${fixtureImageUrlPath}` }
        : { b64_json: fixtureImage.toString('base64') }

      sendJson(response, { created: Math.floor(Date.now() / 1000), data: [image] })

      return
    }

    if (request.method === 'GET' && request.url === fixtureImageUrlPath) {
      response.writeHead(200, { 'Content-Type': 'image/png' }).end(fixtureImage)

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
    stop: () =>
      new Promise((resolve, reject) => {
        server.closeAllConnections()
        server.close((error) => (error ? reject(error) : resolve()))
      }),
  }
}
