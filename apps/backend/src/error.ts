import { getLogger } from '@presenter/node'

import analytics from './services/analytics'
import ipc from './services/ipc'

const logger = getLogger( 'error' )

const portOccupied = () => {
  ipc.send( 'server:ready', undefined )
  logger.warn( 'Another instance is running on port 1699, quitting backend (the UI will connect to the existing instance instead).' )

  process.exit( 0 )
}

const knownErrors = {
  EADDRINUSE: portOccupied,
}

type HandlerErrorOptions = {
  exitIfUnknown?: boolean,

}

// Handle any errors by logging and sending it to Sentry
export const handleError = ( { exitIfUnknown = true }: HandlerErrorOptions ) => async ( error: Error ) => {
  // If error is known, handle it differently
  const knownError = knownErrors[ error.code ]
  if ( knownError ) {
    knownError( error )
    return
  }

  // Log the error, and quit the process
  logger.error( error )
  analytics.sendException( error )

  // Flush any pending data
  await analytics.flush()

  // Quit the server with an error if unknown error
  if ( exitIfUnknown ) process.exit( 1 )
}