import { createServer as createHttpServer, Server } from 'node:http'

import { ClientEvent, ClientEventParameters, ServerEvent, ServerEventParameters } from '@presenter/contract'
import { decode, encode } from '@presenter/swiss-knife'
import { vi } from 'vitest'
import { AddressInfo, WebSocket } from 'ws'

import createWebSocketServer, { Socket } from '~/services/websocket-server'

type CreateServerOptions = {
  httpServer: Server,
}

export const createServer = ( {
  httpServer = createHttpServer(),
}: Partial<CreateServerOptions> = {} ) => {
  const socketServer = createWebSocketServer( { httpServer } )

  // @ts-expect-error we need to simulate different host values for the client
  // eslint-disable-next-line no-param-reassign
  socketServer.on( 'test:set-host', ( host: string, client: Socket ) => { client.host = host } )

  httpServer.listen()

  return { httpServer, socketServer }
}

type SocketClientOptions = {
  httpServer: Server,
}

type SetupSocketClientOptions = {
  host?: string,
}

export const createSocketClient = ( { httpServer }: SocketClientOptions ) => ( {
  host = '192.168.0.10',
}: SetupSocketClientOptions = {} ) => {
  const { port } = httpServer.address() as AddressInfo
  const socketClient = new WebSocket( `ws://localhost:${port}` )

  const isClientReady = new Promise( ( resolve ) => socketClient.on( 'open', resolve ) )
    .then( () => socketClient.send( JSON.stringify( { event: 'test:set-host', payload: host } ) ) )

  const messageHandler = vi.fn()
  socketClient.on( 'message', ( data: string ) => {
    const { event, payload } = decode<{ event: string, payload: unknown }>( data )

    messageHandler( event, payload )
  } )

  const waitForEvent = <
    Event extends ClientEvent,
    Payload extends ClientEventParameters[Event]
  >(
    desiredEvent: Event,
    matcher: ( payload: Payload ) => boolean = () => true
  ) => new Promise<Payload>( ( resolve ) => {
    const handler = ( data: string ) => {
      const { event, payload } = decode<{ event: Event, payload: Payload }>( data )

      if ( desiredEvent !== event || !matcher( payload ) ) return

      resolve( payload )
      socketClient.off( 'message', handler )
    }

    socketClient.on( 'message', handler )
  } )

  const sendEvent = <Event extends ServerEvent>(
    event: Event,
    payload: ServerEventParameters[Event],
  ) => isClientReady.then(
    () => socketClient.send( encode( { event, payload } ) )
  )

  return {
    waitForEvent,
    sendEvent,
    socketClient,
    host,
    messageHandler,
    isClientReady,
  }
}

export type SocketClient = ReturnType<ReturnType<typeof createSocketClient>>
