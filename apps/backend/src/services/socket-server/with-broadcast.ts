import { ClientEvent, ClientEventParameters } from '@presenter/contract'
import { Server } from 'ws'

import { EventsSocket } from './with-events'

export type BroadcastServer<Socket extends EventsSocket> = {
  broadcast: <Event extends ClientEvent>( event: Event ) => (
    payload: ( ( client: Socket ) => ClientEventParameters[Event] ) | ClientEventParameters[Event]
  ) => void,
}

const withBroadcast = <Socket extends EventsSocket>() => ( socketServer: Server<Socket> ) => {
  const server = socketServer as Server<Socket> & BroadcastServer<Socket>

  server.broadcast = ( event ) => ( payload ) => server
    .clients
    .forEach( ( client ) => client.sendJSON( event, typeof payload === 'function' ? payload( client ) : payload ) )

  return server
}

export default withBroadcast
