/* eslint-disable no-param-reassign */
import http from 'http'
import { Server, WebSocket } from 'ws'

type ClientHandler<Socket extends WebSocket> = ( (
  client: Socket,
  request: http.IncomingMessage
) => Promise<void> | void )

export type ConnectionEventsServer<Socket extends WebSocket> = {
  onConnection: ( fn: ClientHandler<Socket> ) => void,
  on: ( event: 'disconnection' | 'connection:ready', callback: ( client: Socket ) => void ) => void,
}

export type ConnectionEventsSocket = WebSocket & {
  isReady: boolean,
}

const withConnectionEvents = <Socket extends WebSocket>() => ( socketServer: Server<Socket> ) => {
  type AugmentedSocket = Socket & ConnectionEventsSocket
  const server = socketServer as Server<AugmentedSocket> & ConnectionEventsServer<AugmentedSocket>

  const connectionMiddleware: ClientHandler<AugmentedSocket>[] = []

  server.onConnection = ( handler ) => connectionMiddleware.push( handler )

  const runConnectionMiddleware = async (
    client: AugmentedSocket,
    request: http.IncomingMessage
  ) => {
    // eslint-disable-next-line no-restricted-syntax
    for ( const handler of connectionMiddleware ) {
      // eslint-disable-next-line no-await-in-loop
      await handler( client, request )
    }

    client.on( 'close', () => server.emit( 'disconnection', client ) )

    client.isReady = true
    server.emit( 'connection:ready', client )
  }

  server.on( 'connection', ( client, request ) => void runConnectionMiddleware( client, request ) )

  return server
}

export default withConnectionEvents
