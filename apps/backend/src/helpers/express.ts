import { getLogger } from '@presenter/node'
import bodyParser from 'body-parser'
import compression from 'compression'
import cors from 'cors'
import express, { Router } from 'express'
import helmet from 'helmet'
import http from 'http'

const log = getLogger( 'express' )

const MIDDLEWARE = [ helmet(), compression(), bodyParser.json(), cors() ]

export type Mount = { dir: string, prefix: string }

const createExpress = ( api: Router, mounts: Mount[] = [] ) => {
  log.info( 'Setting up express' )
  const app = express()

  const server = http.createServer( app )

  MIDDLEWARE.forEach( ( m ) => app.use( m ) )
  log.info( 'Loaded all middleware' )

  mounts.forEach( ( { dir, prefix } ) => app.use( prefix, express.static( dir ) ) )
  log.info( 'Loaded all directory mounts' )

  app.use( api )
  log.info( 'Loaded API' )

  return server
}

export default createExpress
