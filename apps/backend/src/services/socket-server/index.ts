import { getLogger } from '@presenter/node'
import { pipe } from 'fp-ts/function'
import * as http from 'http'
import { omit } from 'lodash'
import WebSocket, { Server } from 'ws'

import withBroadcast, { BroadcastServer } from './with-broadcast'
import withConnectionEvents, { ConnectionEventsServer, ConnectionEventsSocket } from './with-connection-state'
import withEvents, { EventsServer, EventsSocket } from './with-events'
import withHeartbeat, { HeartbeatSocket } from './with-heartbeat'
import withHostInformation, { HostInformationSocket } from './with-host-information'

const log = getLogger( 'socket' )

export type SocketClient = ConnectionEventsSocket
  & EventsSocket
  & HeartbeatSocket
  & HostInformationSocket

type SocketServerOptions = {
  httpServer: http.Server,
}

export type SocketServer = ReturnType<typeof createSocketServer>

const createSocketServer = ( { httpServer }: SocketServerOptions ) => {
  type SocketServer =
    ConnectionEventsServer<SocketClient>
    & BroadcastServer<SocketClient>
    & EventsServer<SocketClient>

  log.info( 'Setting up WebSocket server' )

  const server = pipe(
    new WebSocket.Server<SocketClient>( { server: httpServer } ),
    withConnectionEvents(),
    withHeartbeat(),
    withHostInformation(),
    withEvents(),
    withBroadcast(),
  ) as SocketServer & Server<SocketClient>

  server.on( 'connection:ready', ( client ) => log.info( `${client.host} connected` ) )
  server.on( 'disconnection', ( client ) => log.info( `${client.host} disconnected` ) )

  return omit( server, [ 'onConnection' ] )
}

export default createSocketServer
