import analytics from './lib/analytics'
import { setupExpress } from './lib/express'
import SessionManager from './lib/SessionManager'
import Socket from './lib/Sockets'
import { searchLines, getBanis, updateLoop } from './lib/db'
import logger from './lib/logger'
import { PORT, CUSTOM_THEMES_FOLDER, HISTORY_FILE } from './lib/consts'
import { ensureRequiredDirs } from './lib/utils'

/**
 * Async entry point for application.
 */
async function main() {
  logger.info( 'Starting...' )

  // Check if the data directories for the app exists, otherwise create it
  ensureRequiredDirs()

  // Setup the express server with WebSockets
  const mounts = [
    { prefix: '/', dir: `${__dirname}/frontend/build` },
    { prefix: '/themes', dir: `${__dirname}/frontend/themes` },
    { prefix: '/themes', dir: CUSTOM_THEMES_FOLDER },
    { prefix: '/history.csv', dir: HISTORY_FILE },
  ]

  const server = await setupExpress( mounts )

  // Setup the websocket server
  const socket = new Socket( server )

  // Setup the session manager on top of the Socket instance
  // eslint-disable-next-line
  const sessionManager = new SessionManager( socket )

  // Register searches on the socket instance
  socket.on( 'search', async ( client, search ) => client.sendJSON( 'results', await searchLines( search ) ) )

  // Register Bani list requests on socket connection
  socket.on( 'connection', async client => client.sendJSON( 'banis', await getBanis() ) )

  // Start the server
  server.listen( PORT, () => logger.info( `Running express API server on port ${PORT}` ) )

  // Check for database updates every 5 minutes
  updateLoop()
}


// Handle any errors by crashing
main().catch( error => {
  logger.error( error )
  process.exit( 1 )
} )
