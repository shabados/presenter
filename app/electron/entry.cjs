const { spawn } = require( 'child_process' )
const { app } = require( 'electron' )

const LAUNCH_FLAG = '--start-server'

const { execPath, argv, env } = process
env.NODE_ENV = 'production'

const [ , processFlag ] = argv

;( async () => {
  const { LOG_FILE } = await import( '../lib/consts.js' )
  const logger = ( await import( '../lib/logger.js' ) ).default

  const spawnServer = () => spawn( execPath, [ LAUNCH_FLAG ], {
    env: { LOG_FILE },
    stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ],
  } )

  if ( processFlag === LAUNCH_FLAG ) {
    await import( '../server.js' )
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

    const electronWrapper = ( await import( './electron-wrapper.js' ) ).default
    electronWrapper( server )
  }
} )()
