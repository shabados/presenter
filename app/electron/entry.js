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
const loadServer = () => { require( '../server' ) }

/**
 * Function to load the electron wrapper for frontend.
 */
const loadElectron = server => { require( './electron-wrapper' )( server ) }

// Load either Electron shell or backend server depending on flag
const [ , processFlag ] = argv

if ( processFlag === LAUNCH_FLAG ) {
  loadServer()
} else {
  // Spawn the server in another process
  let server

  // If the server dies, attempt to restart it
  // eslint-disable-next-line no-unused-vars
  const onServerExit = ( code, _signal ) => {
    // Don't restart clean exits
    if ( code === 0 ) return

    logger.warn( 'Restarting server after receiving exit code', code )
    server = spawnServer()
    server.on( 'exit', onServerExit )
  }

  server = spawnServer()
  server.on( 'exit', onServerExit )

  // Guarantee the death of the app if the app encounters an exception
  const ensureQuitApp = () => {
    logger.info( 'got here first' )
    app.quit()
  }

  process.on( 'SIGINT', ensureQuitApp )
  process.on( 'uncaughtException', ensureQuitApp )
  process.on( 'exit', ensureQuitApp )

  loadElectron( server )
}
