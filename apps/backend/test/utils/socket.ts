import { createServer as createHttpServer, Server } from 'node:http'

import { ClientEvent, ClientEventParameters, ServerEvent, ServerEventParameters } from '@presenter/contract'
import { AddressInfo, WebSocket } from 'ws'

import createSocketServer, { SocketClient } from '../../src/services/socket-server'

type CreateServerOptions = {
  httpServer: Server,
}

export const createServer = ( {
  httpServer = createHttpServer(),
}: Partial<CreateServerOptions> = {} ) => {
  const socketServer = createSocketServer( { httpServer } )

  // eslint-disable-next-line no-param-reassign
  socketServer.on( 'test:set-host', ( host: string, client: SocketClient ) => { client.host = host } )

  httpServer.listen()

  const waitForEvent = <Event extends ServerEvent>(
    event: Event
  ): Promise<ServerEventParameters[Event]> => new Promise(
    ( resolve ) => { socketServer.once( event, resolve ) }
  )

  return { httpServer, waitForEvent, socketServer }
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
  const socketClient = new WebSocket( `ws://localhost:${port}`, { } )

  const isClientReady = new Promise<void>( ( resolve ) => socketClient.on( 'open', resolve ) )
    .then( () => socketClient.send( JSON.stringify( { event: 'test:set-host', payload: host } ) ) )

  const waitForEvent = <Event extends ClientEvent>(
    desiredEvent: Event
  ): Promise<ClientEventParameters[Event]> => new Promise( ( resolve ) => {
    const handler = ( data: string ) => {
      const { event, payload } = JSON.parse( data )

      if ( desiredEvent !== event ) return

      resolve( payload as ClientEventParameters[Event] )
      socketClient.off( 'message', handler )
    }

    socketClient.on( 'message', handler )
  } )

  const sendEvent = <Event extends ServerEvent>(
    event: Event,
    payload: ServerEventParameters[Event],
  ) => isClientReady.then( () => socketClient.send( JSON.stringify( { event, payload } ) ) )

  return { waitForEvent, sendEvent, socketClient, host }
}
