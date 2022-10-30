import { createWriteStream } from 'node:fs'
import { dirname } from 'node:path'
import { stdout } from 'node:process'
import { PassThrough } from 'node:stream'

import pino from 'pino'

import { isProductionElectron, isTest } from './environment'
import { ensureFolder, LOG_FILE } from './paths'

const prettyPrintSettings = {
  colorize: true,
  ignore: 'hostname,pid',
  translateTime: 'HH:MM:ss.l',
}

type LogOptions = {
  logFile: string,
  isProduction?: boolean,
}

const Log = ( {
  isProduction,
  logFile,
}: LogOptions ) => {
  const logThrough = new PassThrough()
  const log = pino( {
    ...( !isProduction && !isTest && {
      transport: { target: 'pino-pretty', options: prettyPrintSettings },
    } ),
  }, logThrough )

  const attachFileStream = () => {
    if ( !logFile ) return

    void ensureFolder( dirname( logFile ) )
      .then( () => logThrough.pipe( createWriteStream( logFile, { flags: 'a' } ) ) )
      .catch( ( err: Error ) => log.error( { err }, 'Error creating log file' ) )
  }
  const attachStdoutStream = () => logThrough.pipe( stdout )

  if ( isProduction ) attachFileStream()
  else attachStdoutStream()

  const getLogger = ( module: string ) => log.child( { module } )

  return { getLogger }
}

export const { getLogger } = Log( {
  isProduction: isProductionElectron,
  logFile: LOG_FILE,
} )
