import logger from './logger'
import analytics from './analytics'
import { sendToElectron } from './utils'

const portOccupied = () => {
  sendToElectron( 'ready' )
  logger.warn( 'Another instance is running on port 1699, quitting backend (the UI will connect to the existing instance instead).' )

  process.exit( 0 )
}

const knownErrors = {
  EADDRINUSE: portOccupied,
}

// Handle any errors by logging and sending it to Sentry
export const handleError = ( exitIfUnknown = true ) => error => {
  // If error is known, handle it differently
  const knownError = knownErrors[ error.code ]
  if ( knownError ) {
    knownError( error )
    return
  }

  // Log the error, and quit the process
  logger.error( error )
  analytics.sendException( error )

  // Quit the server with an error if unknown error
  if ( exitIfUnknown ) process.exit( 1 )
}
