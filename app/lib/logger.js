/**
 * Simple logging with bunyan
 * @ignore
 */

import pino from 'pino'
import { spawn } from 'child_process'
import { PassThrough } from 'stream'
import { env, execPath, stdout } from 'process'

import { electronVersion, isDev } from './consts'

const logThrough = new PassThrough()

const logger = pino( {
  prettyPrint: isDev && { colorize: true, ignore: 'hostname,pid', translateTime: 'HH:MM:ss.l' },
}, logThrough )


if ( electronVersion && !isDev ) {
  const { LOG_FILE } = env

  const child = spawn( execPath, [
    require.resolve( 'pino-tee' ),
    'info', LOG_FILE,
  ], {
    cwd: __dirname,
    env,
  } )

  logThrough.pipe( child.stdin )
}

logThrough.pipe( stdout )

export default logger
