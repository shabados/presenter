import { createWriteStream } from 'node:fs'
import { dirname } from 'node:path'
import { stdout } from 'node:process'
import { PassThrough } from 'node:stream'

import pino from 'pino'

import { isProductionElectron } from './environment'
import { ensureFolder, LOG_FILE } from './paths'

type LoggerOptions = {
  logFile?: string,
  prettyPrint?: boolean,
  level?: pino.Level,
}

const createLogger = ( {
  prettyPrint,
  logFile,
  level = 'info',
}: LoggerOptions ) => {
  const logThrough = new PassThrough()
  const log = pino( {
    ...( prettyPrint && {
      transport: {
        target: 'pino-pretty',
        options: { colorize: true, ignore: 'hostname,pid' },
      },
    } ),
    level,
  }, logThrough )

  const attachFileStream = () => {
    if ( !logFile ) return

    void ensureFolder( dirname( logFile ) )
      .then( () => logThrough.pipe( createWriteStream( logFile, { flags: 'a' } ) ) )
      .catch( ( err: Error ) => log.error( { err }, 'Error creating log file' ) )
  }
  const attachStdoutStream = () => logThrough.pipe( stdout )

  if ( logFile ) attachFileStream()
  else attachStdoutStream()

  const getLogger = ( name: string ) => log.child( { name } )

  return { getLogger }
}

export const { getLogger } = createLogger( {
  prettyPrint: true,
  ...( isProductionElectron && {
    logFile: LOG_FILE,
    prettyPrint: false,
  } ),
  level: process.env.LOG_LEVEL as pino.Level | undefined,
} )
