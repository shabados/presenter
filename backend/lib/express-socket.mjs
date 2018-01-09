/**
 * Express Server and WebSockets.
 * @ignore
 */

import http from 'http'

import WebSocket from 'ws'
import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'

import logger from './logger'

const DEFAULT_MIDDLEWARE = [ helmet(), compression(), bodyParser.json() ]

/**
 * Sets up Express and WebSocket server.
 * @param middleware Any array of middleware that will be registered
 * @returns {Function} The instance of the http server
 */
export const setupExpressSocket = ( middleware = [] ) => {
  const allMiddleware = [ ...DEFAULT_MIDDLEWARE, ...middleware ]

  logger.info( 'Setting up express' )
  const app = express()

  const server = http.createServer( app )

  const socket = new WebSocket.Server( { server } )

  allMiddleware.forEach( m => app.use( m ) )
  logger.info( 'Loaded all middleware' )

  return { server, socket }
}
