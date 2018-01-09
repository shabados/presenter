import logger from './lib/logger'

/**
 * Async entry point for application.
 */
async function main() {
  logger.info( 'Starting...' )
}


// Handle any errors by crashing
main.catch( error => {
  logger.error( error )
  process.exit( 1 )
} )
