import { setupExpress } from './lib/express'
import SessionManager from './lib/SessionManager'
import Socket from './lib/Sockets'

import logger from './lib/logger'

/**
 * Async entry point for application.
 */
async function main() {
  logger.info( 'Starting...' )

  // Setup the express server with websockets
  const server = await setupExpress()

  // Setup the websocket server
  const socket = new Socket( server )

  // Setup the session manager on top of the Socket instance
  // eslint-disable-next-line
  const sessionManager = new SessionManager( socket )

  // Start the server
  const port = process.env.PORT || 8080
  server.listen( port, () => logger.info( `Running express API server on port ${port}` ) )
}


// Handle any errors by crashing
main().catch( error => {
  logger.error( error )
  process.exit( 1 )
} )
