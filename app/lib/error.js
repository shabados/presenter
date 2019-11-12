import logger from './logger'
import analytics from './analytics'
import { sendToElectron } from './utils'

const portOccupied = () => {
  sendToElectron( 'ready' )
  logger.warn( 'Another instance is running on port 1699, quitting backend (the UI will connect to the existing instance instead).' )
}

const knownErrors = {
  EADDRINUSE: portOccupied,
}

// Handle any errors by logging and sending it to Sentry
export const handleError = error => {
  // If error is known and ok, log a warning message
  const knownError = knownErrors[ error.code ]
  if ( knownError ) {
    knownError( error )
    return
  }

  logger.error( error )
  analytics.sendException( error )
}
