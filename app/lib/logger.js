/**
 * Simple logging with bunyan
 * @ignore
 */

import pino from 'pino'
import { createWriteStream } from 'fs-extra'
import { PassThrough } from 'stream'
import { stdout } from 'process'

import { electronVersion, isDev, LOG_FILE, LOG_FOLDER } from './consts'
import { ensureRequiredDir } from './utils'

const logThrough = new PassThrough()

const logger = pino( {
  prettyPrint: isDev && { colorize: true, ignore: 'hostname,pid', translateTime: 'HH:MM:ss.l' },
}, logThrough )

// Only write to file in electron production builds
if ( electronVersion && !isDev ) {
  ensureRequiredDir( LOG_FOLDER ).then( () => {
    logThrough.pipe( createWriteStream( LOG_FILE, { flags: 'a' } ) )
  } )
}

// Pipe all log output to stdout in dev only
if ( isDev ) logThrough.pipe( stdout )

export default logger
