/**
 * WebSocket Server and related events.
 * @ignore
 */

import WebSocket from 'ws'

import logger from './logger'

/**
 * Sets up WebSocket server
 * @returns {Function} The event socket
 */
export const setupWebsocket = server => {
  logger.info( 'Setting up WebSocket server' )
  return new WebSocket.Server( { server } )
}
