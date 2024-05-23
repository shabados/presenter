import { getLogger } from '@presenter/node'

import ipc from '~/services/ipc'

const logger = getLogger( 'error' )

const portOccupied = () => {
  ipc.send( 'server:ready', undefined )
  logger.warn( 'Another instance is running on port 1699, quitting backend (the UI will connect to the existing instance instead).' )

  process.exit( 0 )
}

const knownErrors = {
  EADDRINUSE: portOccupied,
} as Record<string, ( error: NodeJS.ErrnoException ) => void>

type HandlerErrorOptions = {
  exitIfUnknown?: boolean,

}

export const handleError = ( {
  exitIfUnknown = true,
}: HandlerErrorOptions ) => async ( error: NodeJS.ErrnoException ) => {
  // If error is known, handle it differently
  const customHandler = error.code && knownErrors[ error.code ]
  if ( customHandler ) {
    customHandler( error )
    return
  }
  // Log the error, and quit the process
  logger.error( error )

  // Flush any pending data

  // Quit the server with an error if unknown error
  if ( exitIfUnknown ) process.exit( 1 )
}
