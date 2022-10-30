/* eslint-disable global-require */
import { getLogger, LOG_FILE } from '@presenter/node'
import { spawn } from 'child_process'
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'

const log = getLogger( 'main' )

const LAUNCH_FLAG = '--start-server'

const { execPath, argv, env } = process
env.NODE_ENV = 'production'

const spawnServer = () => spawn( execPath, [ LAUNCH_FLAG ], {
  env: { LOG_FILE },
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ],
} )

const loadServer = () => { require( '../server' ) }
const loadElectron = ( server ) => { require( './electron-wrapper' )( server ) }

const [ , processFlag ] = argv

// Load either Electron shell or backend server depending on flag
if ( processFlag === LAUNCH_FLAG ) {
  loadServer()
} else {
  let server

  // If the server dies, attempt to restart it
  const onServerExit = ( exitCode: number ) => {
    if ( exitCode === 0 ) return

    log.warn( 'Restarting server after receiving exit code', exitCode )
    server = spawnServer()
    server.on( 'exit', onServerExit )
  }

  server = spawnServer()
  server.on( 'exit', onServerExit )

  process.on( 'SIGINT', app.quit )
  process.on( 'exit', app.quit )
  process.on( 'uncaughtException', ( err ) => {
    log.error( err )
    app.quit()
  } )

  loadElectron( server )
}
