import logger from './logger'
import analytics from './analytics'

const knownErrors = {
  EADDRINUSE: 'Another instance is running on port 1699, quitting backend (the UI will connect to the existing instance instead).',
}

// Handle any errors by logging and sending it to Sentry
export const handleError = error => {
  // If error is known and ok, log a warning message
  const knownError = knownErrors[ error.code ]
  if ( knownError ) {
    logger.warn( knownError )
    return
  }

  logger.error( error )
  analytics.sendException( error )
}
