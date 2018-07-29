import { ensureDirSync } from 'fs-extra'

import { setupExpress } from './lib/express'
import SessionManager from './lib/SessionManager'
import Socket from './lib/Sockets'
import { searchLines } from './lib/db'
import logger from './lib/logger'
import { PORT, DATA_FOLDER } from './lib/consts'

/**
 * Async entry point for application.
 */
async function main() {
  logger.info( 'Starting...' )

  // Check if the data directory for the app exists, otherwise create it
  ensureDirSync( DATA_FOLDER )

  // Setup the express server with WebSockets
  const mounts = [
    { prefix: '/', dir: `${__dirname}/frontend/build` },
    { prefix: '/themes', dir: `${__dirname}/frontend/themes` },
  ]
  const server = await setupExpress( mounts )

  // Setup the websocket server
  const socket = new Socket( server )

  // Setup the session manager on top of the Socket instance
  // eslint-disable-next-line
  const sessionManager = new SessionManager( socket )

  // Register searches on the socket instance
  socket.on( 'search', async ( client, search ) =>
    client.sendJSON( 'results', await searchLines( search ) ) )

  // Start the server
  server.listen( PORT, () => logger.info( `Running express API server on port ${PORT}` ) )
}

// Handle any errors by crashing
main().catch( error => {
  logger.error( error )
  process.exit( 1 )
} )
