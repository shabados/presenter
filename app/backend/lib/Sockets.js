/**
 * WebSocket Server, wrapped in a class with convenience methods.
 * @ignore
 */

import EventEmitter from 'events'

import WebSocket from 'ws'

import { getHost } from './utils'
import logger from './logger'

/**
 * Wrapper for WebSockets with convenience methods.
 */
class Socket extends EventEmitter {
  constructor( server ) {
    super()

    this.socketServer = Socket.setupWebsocket( server )
    this.onConnection()
    // Check for broken connections every 30 seconds
    setInterval( () => this.closeBrokenConnections, 1000 * 30 )
  }

  /**
   * Passes through the connection event, adding heartbeat logic to detect broken connections.
   */
  onConnection() {
    this.socketServer.on( 'connection', async ( socket, { client } ) => {
      // Get hostname or proper IP
      const address = await getHost( client.remoteAddress )

      // Log the connection and disconnection events
      logger.info( `${address} connected` )
      socket.on( 'close', () => logger.info( `${address} disconnected` ) )

      // Keep connection alive if heartbeat received
      // eslint-disable-next-line
      socket.issAlive = true
      // eslint-disable-next-line
      socket.on( 'pong', () => socket.isAlive = true )

      // Modify the send to stringify first
      // eslint-disable-next-line
      socket.sendJSON = ( event, payload ) => socket.send( JSON.stringify( { event, payload } ) )

      // Parse the JSON sent, before emitting it
      socket.on( 'message', data => {
        const { event, payload } = JSON.parse( data )
        this.emit( event, socket, payload )
      } )

      // Emit the connection event
      this.emit( 'connection', socket )
    } )
  }

  /**
   * Broadcasts the provided data to each client, optionally excluding any.
   * @param event The event name.
   * @param payload The JSON data to send.
   * @param excludedClients The clients to exclude from the transmission.
   */
  broadcast( event, payload, excludedClients = [] ) {
    const { clients } = this.socketServer

    clients.forEach( client => {
      // Transmit if not in the list and the WebSocket is open
      if ( !excludedClients.includes( client ) && client.readyState === WebSocket.OPEN ) {
        client.sendJSON( event, payload )
      }
    } )
  }

  /**
   * Terminates any broken connections, by checking if they responded to the heartbeat.
   */
  closeBrokenConnections() {
    const { clients } = this.socketServer

    clients.forEach( socket => {
      // Terminate any dead sockets
      if ( !socket.isAlive ) {
        socket.terminate()
        return
      }

      // Otherwise ping it again
      // eslint-disable-next-line
      socket.isAlive = false
      socket.ping( () => ( {} ) )
    } )
  }

  /**
   * Sets up a WebSocket server.
   * @param server The HTTP server to bind the WebSocket server to
   * @returns {Function} The event socket
   */
  static setupWebsocket( server ) {
    logger.info( 'Setting up WebSocket server' )
    return new WebSocket.Server( { server } )
  }
}

export default Socket
