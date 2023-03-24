/* eslint-disable no-param-reassign */
import { ClientEvent, ClientEventParameters, ServerEvent, ServerEventParameters } from '@presenter/contract'
import { getLogger } from '@presenter/node/src'
import { Server, WebSocket } from 'ws'

import { ConnectionEventsServer, ConnectionEventsSocket } from './with-connection-state'
import { HostInformationSocket } from './with-host-information'

const logger = getLogger( 'socket' )

const withDedupe = <T>( fn: ( event: string, payload: T ) => boolean ) => {
  const previousEvents = new Map()

  return ( event: string, payload: T ) => {
    if ( previousEvents.get( event ) === payload ) return

    const success = fn( event, payload )

    if ( success ) previousEvents.set( event, payload )
  }
}

export type EventsServer<Socket extends WebSocket> = {
  on: <Event extends ServerEvent>(
    event: Event,
    callback: ( data: ServerEventParameters[Event], client: Socket ) => void
  ) => void,
}

export type EventsSocket = WebSocket & {
  sendJSON: <Event extends ClientEvent>(
    event: Event,
    payload: ClientEventParameters[Event],
  ) => void,
}

const withEvents = <
  Socket extends HostInformationSocket & ConnectionEventsSocket
>() => ( socketServer: Server<Socket> ) => {
    type AugmentedSocket = Socket & EventsSocket
    const server = socketServer as Server<AugmentedSocket> & ConnectionEventsServer<AugmentedSocket>

    server.onConnection( ( client ) => {
      client.sendJSON = withDedupe( ( event, payload ) => {
        if ( client.readyState !== WebSocket.OPEN || !client.isReady ) return false

        client.send( JSON.stringify( { event, payload } ) )
        logger.debug( { payload }, `Sent ${event} to ${client.host}` )

        return true
      } )

      client.on( 'message', ( data: string ) => {
        const { event, payload } = JSON.parse( data ) as { event: string, payload?: unknown }

        server.emit( event, payload, client )
      } )
    } )

    return server
}

export default withEvents
