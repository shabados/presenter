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
  /**
   * Initialses the WebSocket class.
   * @param {Object} server The HTTP server to bind the WebSocket server to.
   */
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
      // Modify the send to stringify first
      // eslint-disable-next-line
      socket.sendJSON = ( event, payload ) => socket.send( JSON.stringify( { event, payload } ) )

      // Get hostname or proper IP
      // eslint-disable-next-line
      socket.host = await getHost( client.remoteAddress )

      // Log the connection and disconnection events
      logger.info( `${socket.host} connected` )

      socket.on( 'close', () => {
        logger.info( `${socket.host} disconnected` )
        this.emit( 'disconnection', socket )
      } )

      // Keep connection alive if heartbeat received
      // eslint-disable-next-line
      socket.issAlive = true
      // eslint-disable-next-line
      socket.on( 'pong', () => socket.isAlive = true )

      // Parse the JSON sent, before emitting it
      socket.on( 'message', data => {
        const { event, payload } = JSON.parse( data )
        this.emit( event, socket, payload )
      } )

      // Emit the connection event
      // Send custom ready event
      socket.sendJSON( 'ready' )
      this.emit( 'connection', socket )
    } )
  }

  /**
   * Broadcasts the provided data to each client, optionally excluding any.
   * @param {string} event The event name.
   * @param {*} payload The JSON data to send.
   * @param {WebSocket[]} excludedClients The clients to exclude from the transmission.
   */
  broadcast( event, payload, excludedClients = [] ) {
    this.forEach( client => client.sendJSON && client.sendJSON( event, payload ), excludedClients )
  }

  /**
   * Gets all the active clients.
   */
  getClients() {
    const { clients } = this.socketServer

    return Array.from( clients )
  }

  /**
  * Iterates over each actively connected client.
  * @param {Function} fn The function to execute, provided with the client as a parameter.
  * @param {WebSocket[]} excludedClients Any excluded clients.
  */
  forEach( fn, excludedClients = [] ) {
    this.getClients().forEach( client => {
      if ( !client.sendJSON ) return

      // Only include non-excluded clients and open connections
      if ( !excludedClients.includes( client ) && client.readyState === WebSocket.OPEN ) {
        fn( client )
      }
    } )
  }

  /**
   * Terminates any broken connections, by checking if they responded to the heartbeat.
   */
  closeBrokenConnections() {
    this.getClients().forEach( socket => {
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
   * @param {Object} server The HTTP server to bind the WebSocket server to.
   * @returns {Function} The event socket.
   */
  static setupWebsocket( server ) {
    logger.info( 'Setting up WebSocket server' )
    return new WebSocket.Server( { server } )
  }
}

export default Socket
