import { getLogger } from '@presenter/node'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import http from 'http'

import { PORT } from '../helpers/consts'
import ipc from './ipc'

const log = getLogger( 'express' )

const middleware = [ helmet(), compression(), bodyParser.json(), cors() ]

const createExpress = () => {
  const app = express()
  const httpServer = http.createServer( app )

  middleware.forEach( ( m ) => app.use( m ) )
  log.info( 'Loaded all middleware' )

  const listen = () => httpServer.listen( PORT, () => {
    ipc.send( 'server:ready', undefined )
    log.info( `Listening for socket connections and API calls on port ${PORT}` )
  } )

  return { app, httpServer, listen }
}

export default createExpress
