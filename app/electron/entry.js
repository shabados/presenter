/* eslint-disable global-require */
const { spawn } = require( 'child_process' )
// eslint-disable-next-line import/no-extraneous-dependencies
const { app } = require( 'electron' )

const LAUNCH_FLAG = '--start-server'

const { execPath, argv, env } = process
env.NODE_ENV = 'production'

const { LOG_FILE } = require( '../lib/consts' )

// Add file logging
const logger = require( '../lib/logger' ).default

/**
 * Launches a server in a separate process, with flag.
 */
const spawnServer = () => spawn( execPath, [ LAUNCH_FLAG ], {
  env: { LOG_FILE, ESM_DISABLE_CACHE: 1 },
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ],
} )

// Define loader functions

/**
 * Function to load server.
 */
const loadServer = () => {
  // IPC message handler used to indicate termination
  process.on( 'message', ( { event } ) => {
    if ( event !== 'quit' ) return

    logger.info( 'Gracefully quitting backend' )
    app.quit()
  } )

  // Start the server
  require( '../server' )
}

/**
 * Function to load the electron wrapper for frontend.
 */
const loadElectron = server => { require( './electron-wrapper' )( server ) }

// Load either Electron shell or backend server depending on flag
const [ , processFlag ] = argv

if ( processFlag === LAUNCH_FLAG ) {
  loadServer()
} else {
  const server = spawnServer()
  const killServer = () => server.send( { event: 'quit' } )

  process.on( 'SIGINT', killServer )
  process.on( 'uncaughtException', killServer )
  process.on( 'exit', killServer )

  loadElectron( server )
}
