import { Server } from 'http'
import { AddressInfo } from 'net'
import { request } from 'undici'

type FetchClientOptions = {
  httpServer: Server,
}

export const fetchApi = ( { httpServer }: FetchClientOptions ) => <T>(
  path: string,
) => {
  const { port } = httpServer.address() as AddressInfo

  const url = `http://localhost:${port}${path}`

  return request( url ).then( ( { body } ) => body.json() as T )
}
