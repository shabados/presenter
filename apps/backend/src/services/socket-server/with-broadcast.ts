import { ClientEvent, ClientEventParameters } from '@presenter/contract'
import { Server } from 'ws'

import { EventsSocket } from './with-events'

export type BroadcastServer<Socket extends EventsSocket> = {
  broadcast: <Event extends ClientEvent>(
    event: Event,
    getPayload: ( client: Socket ) => ClientEventParameters[Event],
  ) => void,
}

const withBroadcast = <Socket extends EventsSocket>() => ( socketServer: Server<Socket> ) => {
  const server = socketServer as Server<Socket> & BroadcastServer<Socket>

  server.broadcast = ( event, getPayload ) => server
    .clients
    .forEach( ( client ) => client.sendJSON( event, getPayload( client ) ) )

  return server
}

export default withBroadcast
