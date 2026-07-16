import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { app } from 'electron'

import { LOG_FILE, isDev } from '@shabados/backend/lib/consts.js'
import logger from '@shabados/backend/lib/logger.js'

const LAUNCH_FLAG = '--start-server'

const { execPath, argv, env } = process
env.NODE_ENV = 'production'

const [ ,, processFlag ] = argv

const entryPath = fileURLToPath( import.meta.url )

const spawnServer = () => spawn( execPath, [ entryPath, LAUNCH_FLAG ], {
  env: { LOG_FILE },
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ],
} )

if ( processFlag === LAUNCH_FLAG ) {
  await import( '@shabados/backend/server.js' )
} else if ( isDev ) {
  // Dev: backend runs separately via npm start, no server spawn needed
  const { default: electronWrapper } = await import( './electron-wrapper.js' )
  electronWrapper( null )
} else {
  let server

  const onServerExit = ( code, _signal ) => {
    if ( code === 0 ) return

    logger.warn( 'Restarting server after receiving exit code', code )
    server = spawnServer()
    server.on( 'exit', onServerExit )
  }

  server = spawnServer()
  server.on( 'exit', onServerExit )

  const ensureQuitApp = () => app.quit()

  process.on( 'SIGINT', ensureQuitApp )
  process.on( 'uncaughtException', err => logger.error( err ) || ensureQuitApp() )
  process.on( 'exit', ensureQuitApp )

  const { default: electronWrapper } = await import( './electron-wrapper.js' )
  electronWrapper( server )
}
