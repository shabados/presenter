/**
 * Simple logging with bunyan
 * @ignore
 */

import pino from 'pino'
import { appendFile } from 'fs-extra'
import { PassThrough } from 'stream'
import { env, stdout } from 'process'

import { electronVersion, isDev, LOG_FILE } from './consts'

const logThrough = new PassThrough()

const logger = pino( {
  prettyPrint: isDev && { colorize: true, ignore: 'hostname,pid', translateTime: 'HH:MM:ss.l' },
}, logThrough )


if ( electronVersion && !isDev ) {
  logThrough.on( 'data', data => appendFile(
    env.LOG_FILE || LOG_FILE,
    data.toString(),
  ) )
}

logThrough.pipe( stdout )

export default logger
