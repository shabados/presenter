/* eslint-disable no-param-reassign */
import { ClientEvent, ClientEventParameters, ServerEvent, ServerEventParameters } from '@presenter/contract'
import { Server, WebSocket } from 'ws'

import { ConnectionReadyServer, ReadySocket } from './with-connection-state'

export type EventsServer = {
  on: <Event extends ServerEvent>(
    event: Event,
    callback: ( data: ServerEventParameters[Event] ) => void
  ) => void,
}

export type EventsSocket = WebSocket & {
  sendJSON: <Event extends ClientEvent>(
    event: Event,
    payload: ClientEventParameters[Event],
  ) => void,
}

const withEvents = <
  Socket extends ReadySocket
>() => ( socketServer: Server<Socket> ) => {
    type AugmentedSocket = Socket & EventsSocket
    const server = socketServer as Server<AugmentedSocket> & ConnectionReadyServer<AugmentedSocket>

    server.onConnection( ( client ) => {
      client.sendJSON = ( event, payload ) => {
        if ( client.readyState !== WebSocket.OPEN || !client.isReady ) return

        client.send( JSON.stringify( { event, payload } ) )
      }

      client.on( 'message', ( data: string ) => {
        const { event, payload } = JSON.parse( data ) as { event: string, payload?: unknown }

        server.emit( event, payload, client )
      } )
    } )

    return server
}

export default withEvents
