/**
 * Express Server.
 * @ignore
 */

import http from 'http'

import express from 'express'
import helmet from 'helmet'
import compression from 'compression'
import bodyParser from 'body-parser'

import logger from './logger'

const DEFAULT_MIDDLEWARE = [ helmet(), compression(), bodyParser.json() ]

/**
 * Sets up Express
 * @param middleware Any array of middleware that will be registered
 * @returns {Function} The instance of the http server
 */
export const setupExpress = ( middleware = [] ) => {
  const allMiddleware = [ ...DEFAULT_MIDDLEWARE, ...middleware ]

  logger.info( 'Setting up express' )
  const app = express()

  const server = http.createServer( app )

  allMiddleware.forEach( m => app.use( m ) )
  logger.info( 'Loaded all middleware' )

  return server
}
