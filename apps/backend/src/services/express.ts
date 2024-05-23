import { getLogger } from '@presenter/node'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import http from 'http'

import { PORT } from '~/helpers/consts'
import ipc from '~/services/ipc'

const log = getLogger( 'express' )

const middleware = [ helmet(), compression(), bodyParser.json(), cors() ]

const createExpress = () => {
  const api = express()
  const httpServer = http.createServer( api )

  middleware.forEach( ( m ) => api.use( m ) )
  log.info( 'Loaded all middleware' )

  const listen = () => httpServer.listen( PORT, () => {
    ipc.send( 'server:ready', undefined )
    log.info( `Listening for socket connections and API calls on port ${PORT}` )
  } )

  return { api, httpServer, listen }
}

export default createExpress
