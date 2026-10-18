import { createServer } from 'node:http'
import type { AddressInfo } from 'node:net'

export type FakeImageApi = {
  baseUrl: string
  stop: () => Promise<void>
}

export async function startFakeImageApi(): Promise<FakeImageApi> {
  const server = createServer((_request, response) => response.writeHead(404).end())

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })

  const { port } = server.address() as AddressInfo

  return {
    baseUrl: `http://127.0.0.1:${port}`,
    stop: () =>
      new Promise((resolve, reject) => {
        server.closeAllConnections()
        server.close((error) => (error ? reject(error) : resolve()))
      }),
  }
}
