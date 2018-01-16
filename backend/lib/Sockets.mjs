/**
 * WebSocket Server, wrapped in a class with convenience methods.
 * @ignore
 */

import WebSocket from 'ws'

import { getHost } from './utils'
import logger from './logger'

/**
 * Wrapper for WebSockets with convenience methods.
 */
class Socket {
  constructor( server ) {
    this.socketServer = Socket.setupWebsocket( server )

    // Check for broken connections every 30 seconds
    setInterval( () => this.closeBrokenConnections, 1000 * 30 )
  }

  /**
   * Passes through the connection event, adding heartbeat logic to detect broken connections.
   * @param callback The function to execute on connection
   */
  onConnection( callback ) {
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
      socket.sendJSON = data => socket.send( JSON.stringify( data ) )

      // Call the provided callback, hoping it returns an onMessage function
      const onMessage = callback( socket )
      // Parse the JSON sent, before calling the handler
      socket.on( 'message', data => onMessage( JSON.parse( data ) ) )
    } )
  }

  /**
   * Broadcasts the provided data to each client, optionally excluding any.
   * @param data The data to transmit
   * @param excludedClients The clients to exclude from the transmission
   */
  broadcast( data, excludedClients = [] ) {
    const { clients } = this.socketServer

    clients.forEach( client => {
      // Transmit if not in the list and the WebSocket is open
      if ( !excludedClients.includes( client ) && client.readyState === WebSocket.OPEN ) {
        client.send( data )
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
