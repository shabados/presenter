/* eslint-disable no-param-reassign */
import { Server, WebSocket } from 'ws'

import { ConnectionReadyServer } from './with-connection-state'

const KEEP_ALIVE_INTERVAL = 1000 * 30

export type HeartbeatSocket = WebSocket & {
  isAlive: boolean,
}

const withHeartbeat = <Socket extends WebSocket>() => ( socketServer: Server<Socket> ) => {
  type AugmentedSocket = Socket & HeartbeatSocket
  const server = socketServer as Server<AugmentedSocket> & ConnectionReadyServer<AugmentedSocket>

  server.onConnection( ( client ) => {
    client.isAlive = true

    client.on( 'pong', () => { client.isAlive = true } )
  } )

  const closeBrokenConnections = () => server.clients.forEach( ( client ) => {
    if ( !client.isAlive ) {
      client.terminate()
      return
    }

    client.isAlive = false

    client.ping()
  } )

  setInterval( () => closeBrokenConnections, KEEP_ALIVE_INTERVAL )

  return server
}

export default withHeartbeat
