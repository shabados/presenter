/* eslint-disable no-param-reassign, max-classes-per-file */
import EventEmitter from 'node:events'
import * as http from 'node:http'

import { ClientEvent, ClientEventParameters, ServerEvent, ServerEventParameters } from '@presenter/contract'
import { getLogger } from '@presenter/node'
import { decode, encode } from '@presenter/swiss-knife'
import { WebSocket, WebSocketServer } from 'ws'

import { getHost } from '~/helpers/network'

const KEEP_ALIVE_INTERVAL = 1000 * 30

const log = getLogger( 'websocket' )

export class Socket extends WebSocket {
  isAlive = true
  host = ''

  private state = 'connecting' as 'connecting' | 'connected' | 'disconnecting' | 'disconnected'

  set connectionState( state: Socket['state'] ) {
    this.state = state
    this.emit( `state:${state}` )
  }

  get connectionState() {
    return this.state
  }

  send = ( data: string ) => {
    if ( this.connectionState !== 'connected' ) {
      log.warn( `Cannot send to ${this.host} as the connection is ${this.connectionState}`, data )
      return
    }

    super.send( data )
  }

  json = <Event extends ClientEvent>(
    event: Event,
    payload: ClientEventParameters[Event]
  ) => {
    this.send( encode( { event, payload } ) )
    log.debug( { payload }, `Sent ${event} to ${this.host}` )
  }
}

type ServerEvents = {
  'client:connected': [Socket],
  'client:disconnected': [Socket],
} & {
  [Event in ServerEvent]: [ServerEventParameters[Event], Socket]
}

type ConnectionHandler = (
  client: Socket,
  request: http.IncomingMessage
) => void | Promise<void>

type SocketServerOptions = {
  httpServer: http.Server,
}

export type SocketServer = ReturnType<typeof createWebSocketServer>

const createWebSocketServer = ( { httpServer }: SocketServerOptions ) => {
  log.info( 'Setting up WebSocket server' )

  const server = new WebSocketServer( {
    server: httpServer,
    WebSocket: Socket,
  } )

  const emitter = new EventEmitter<ServerEvents>()

  const connectionMiddleware = [] as ConnectionHandler[]

  const onClientConnect = ( handler: ConnectionHandler ) => connectionMiddleware.push( handler )

  const closeBrokenConnections = () => server.clients.forEach( ( client ) => {
    if ( !client.isAlive ) {
      client.terminate()
      log.warn( `Terminated broken connection for ${client.host}` )
      return
    }

    client.isAlive = false

    client.ping()
  } )

  setInterval( () => closeBrokenConnections, KEEP_ALIVE_INTERVAL )

  server.on( 'connection', ( client, request ) => void Promise
    .all( connectionMiddleware.map( ( handler ) => handler( client, request ) ) )
    .then( () => {
      client.on( 'close', () => {
        client.connectionState = 'disconnected'
        emitter.emit( 'client:disconnected', client )
      } )

      client.connectionState = 'connected'
      emitter.emit( 'client:connected', client )
    } ) )

  const broadcast = <
    Event extends ClientEvent,
    Payload extends ClientEventParameters[Event]
  >( event: Event ) => ( payload: Payload | ( ( client: Socket ) => Payload ) ) => server
    .clients
    .forEach( ( client ) => client.json(
      event,
      typeof payload === 'function' ? payload( client ) : payload
    ) )

  onClientConnect( ( client ) => {
    client.on( 'error', ( error ) => log.error( 'Client error', error ) )
  } )

  onClientConnect( ( client, { socket: { remoteAddress } } ) => getHost( remoteAddress! )
    .then( ( host ) => { client.host = host } )
    .catch( ( error ) => log.error( 'Failed to get host', error ) ) )

  onClientConnect( ( client ) => {
    client.on( 'pong', () => { client.isAlive = true } )
  } )

  onClientConnect( ( client ) => {
    client.on( 'message', ( data: string ) => {
      const { event, payload } = decode< {
        event: ServerEvent,
        payload: ServerEventParameters[ServerEvent],
      }>( data )

      emitter.emit( event, payload, client )
    } )
  } )

  emitter.on( 'client:connected', ( { host } ) => log.info( `${host} connected` ) )
  emitter.on( 'client:disconnected', ( { host } ) => log.info( `${host} disconnected` ) )

  return {
    broadcast,
    on: emitter.on.bind( emitter ),
    off: emitter.off.bind( emitter ),
    once: emitter.once.bind( emitter ),
    clients: server.clients,
  }
}

export default createWebSocketServer
