import logger from './lib/logger'
import { setupExpressSocket } from './lib/express-socket'

/**
 * Async entry point for application.
 */
async function main() {
  logger.info( 'Starting...' )

  // Setup the express server with websockets
  const { server, socket } = await setupExpressSocket()

  // Need to hook events to socket here

  // Start the server
  const port = process.env.PORT || 8080
  server.listen( port, () => logger.info( `Running express API server on port ${port}` ) )
}


// Handle any errors by crashing
main().catch( error => {
  logger.error( error )
  process.exit( 1 )
} )
