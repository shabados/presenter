import { setupExpress } from './lib/express'
import { setupWebsocket } from './lib/sockets'
import { updateDatabase } from './lib/updates'

import logger from './lib/logger'

/**
 * Async entry point for application.
 */
async function main() {
  logger.info( 'Starting...' )

  // Update DB
  await updateDatabase()

  // Setup the express server with websockets
  const server = await setupExpress()

  // Setup the WebSocket server, attaching it to the HTTP instance
  const socket = setupWebsocket( server )

  // Start the server
  const port = process.env.PORT || 8080
  server.listen( port, () => logger.info( `Running express API server on port ${port}` ) )
}


// Handle any errors by crashing
main().catch( error => {
  logger.error( error )
  process.exit( 1 )
} )
