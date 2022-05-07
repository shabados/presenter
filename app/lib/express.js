/**
 * Express Server.
 * @ignore
 */

import bodyParser from 'body-parser'
import compression from 'compression'
import express from 'express'
import helmet from 'helmet'
import http from 'http'

import logger from './logger'

const DEFAULT_MIDDLEWARE = [ helmet(), compression(), bodyParser.json() ]

/**
 * Sets up Express.
 * @param {Array} mounts Array of { dir, prefix } of directories to mount.
 * @param {Array} middleware Any array of middleware that will be registered.
 * @returns {Function} The instance of the http server.
 */
export const setupExpress = ( mounts = [], middleware = [] ) => {
  const allMiddleware = [ ...DEFAULT_MIDDLEWARE, ...middleware ]

  logger.info( 'Setting up express' )
  const app = express()

  const server = http.createServer( app )

  // Register middleware
  allMiddleware.forEach( ( m ) => app.use( m ) )
  logger.info( 'Loaded all middleware' )

  // Serve any passed in directories
  mounts.forEach( ( { dir, prefix = '/' } ) => app.use( prefix, express.static( dir ) ) )
  logger.info( 'Loaded all directory mounts' )

  return server
}
