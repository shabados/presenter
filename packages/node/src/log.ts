import { createWriteStream } from 'node:fs'
import { dirname } from 'node:path'
import { stdout } from 'node:process'
import { PassThrough } from 'node:stream'

import pino from 'pino'

import { isProductionElectron } from './environment'
import { ensureFolder, LOG_FILE } from './paths'

const prettyPrintSettings = {
  colorize: true,
  ignore: 'hostname,pid',
  translateTime: 'HH:MM:ss.l',
}

type LogOptions = {
  logFile?: string,
  prettyPrint?: boolean,
  level?: pino.Level,
}

const Log = ( {
  prettyPrint,
  logFile,
  level = 'info',
}: LogOptions ) => {
  const logThrough = new PassThrough()
  const log = pino( {
    ...( prettyPrint && {
      transport: { target: 'pino-pretty', options: prettyPrintSettings },
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

  const getLogger = ( module: string ) => log.child( { module } )

  return { getLogger }
}

export const { getLogger } = Log( {
  prettyPrint: true,
  ...( isProductionElectron && {
    logFile: LOG_FILE,
    prettyPrint: false,
  } ),
  level: process.env.LOG_LEVEL as pino.Level | undefined,
} )
