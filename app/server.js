import cors from 'cors'
import open from 'open'
import { join } from 'path'

import analytics from './lib/analytics'
import api from './lib/api'
import {
  CUSTOM_OVERLAY_THEMES_FOLDER,
  CUSTOM_THEMES_FOLDER,
  FRONTEND_BUILD_FOLDER,
  FRONTEND_OVERLAY_THEMES_FOLDER,
  FRONTEND_THEMES_FOLDER,
  HISTORY_FILE,
  isDev,
  LOG_FOLDER,
  PORT,
  UPDATE_CHECK_INTERVAL,
  UPDATE_TMP_FOLDER,
} from './lib/consts'
import { firstLetterSearch, fullWordSearch, getBanis } from './lib/db'
import { handleError } from './lib/error'
import { setupExpress } from './lib/express'
import logger from './lib/logger'
import SessionManager from './lib/SessionManager'
import settings from './lib/settings'
import Socket from './lib/Sockets'
import Updater from './lib/Updater'
import { copyExampleThemes, ensureRequiredDirs, sendToElectron } from './lib/utils'
import zoom from './lib/zoom'
import { version } from './package.json'

// Action handlers
const actions = [
  [ 'open-overlay-folder', () => open( CUSTOM_OVERLAY_THEMES_FOLDER ) ],
  [ 'open-external-url', ( url ) => open( url ) ],
  [ 'open-window', ( payload ) => sendToElectron( 'open-window', payload ) ],
  [ 'open-logs-folder', () => open( LOG_FOLDER ) ],
]

// Search types and handlers
const searches = [
  [ 'first-letter', firstLetterSearch ],
  [ 'full-word', fullWordSearch ],
]

/**
 * Sets up updates.
 * @param {SessionManager} sessionManager An instance of sessionManager.
 */
const initialiseUpdater = ( sessionManager ) => {
  const updater = new Updater( {
    tempFolder: UPDATE_TMP_FOLDER,
    interval: UPDATE_CHECK_INTERVAL,
  } )

  // Display notification for 30s, optionally
  const notification = ( message, toast ) => {
    if ( !toast ) return

    sessionManager.notify( message )
  }

  const downloadEvents = () => settings.get( 'notifications.downloadEvents' )
  const downloadedEvents = () => settings.get( 'notifications.downloadedEvents' )

  // Database download events
  updater.on( 'database-update', () => notification( 'Downloading database update', downloadEvents() ) )
  updater.on( 'database-updated', () => notification( 'Database updated', downloadedEvents() ) )

  // Application updater events
  updater.on( 'application-update', () => notification( 'Downloading app update', downloadEvents() ) )
  updater.on( 'application-updated', () => notification( 'Close to install app update', downloadedEvents() ) )

  updater.start()
}

/**
 * Async entry point for application.
 */
async function main() {
  logger.info( `Starting Shabad OS ${version}` )

  // Check if the data directories for the app exists, otherwise create it
  await ensureRequiredDirs()

  // Load backend settings
  await settings.loadSettings()

  // Initialise analytics
  analytics.initialise()

  // Setup the express server with WebSockets
  const mounts = [
    { prefix: '/', dir: FRONTEND_BUILD_FOLDER },
    { prefix: '/presenter/themes', dir: FRONTEND_THEMES_FOLDER },
    { prefix: '/presenter/themes', dir: CUSTOM_THEMES_FOLDER },
    { prefix: '/presenter/themes/*', dir: join( FRONTEND_THEMES_FOLDER, 'Day.css' ) },
    { prefix: '/overlay/themes', dir: FRONTEND_OVERLAY_THEMES_FOLDER },
    { prefix: '/overlay/themes/', dir: CUSTOM_OVERLAY_THEMES_FOLDER },
    { prefix: '/history.csv', dir: HISTORY_FILE },
    { prefix: '*', dir: join( FRONTEND_BUILD_FOLDER, 'index.html' ) },
  ]

  const server = setupExpress( mounts, [ cors(), api ] )

  // Setup the websocket server
  const socket = new Socket( server )

  // Setup the session manager on top of the Socket instance
  const sessionManager = new SessionManager( socket )

  // Register searches on the socket instance
  searches.forEach(
    ( [ name, searchFn ] ) => socket.on( `search:${name}`, async ( client, { query, ...options } ) => client.sendJSON( 'results', await searchFn( query, options ) ) ),
  )

  // Register all action handlers on the socket instance
  actions.forEach(
    ( [ name, handler ] ) => socket.on( `action:${name}`, ( _, payload ) => handler( payload ) ),
  )

  // Register Bani list requests on socket connection
  socket.on( 'connection', async ( client ) => client.sendJSON( 'banis:list', await getBanis() ) )

  // Start the server
  server.listen( PORT, () => {
    sendToElectron( 'ready' )
    logger.info( `Running express API server on port ${PORT}` )
  } )

  // When settings change, notify Electron
  settings.on( 'change', ( settings ) => sendToElectron( 'settings', settings ) )

  // Check for updates every 5 minutes, in production only
  if ( !isDev ) initialiseUpdater( sessionManager )

  // Copy example themes for user
  copyExampleThemes()

  // Initialise zoom controller
  zoom.init()
}

process.on( 'uncaughtException', handleError() )
process.on( 'unhandledRejection', handleError( false ) )

export default main().catch( handleError() )
