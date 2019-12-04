import { join } from 'path'
import cors from 'cors'

import analytics from './lib/analytics'
import { setupExpress } from './lib/express'
import api from './lib/api'
import SessionManager from './lib/SessionManager'
import Socket from './lib/Sockets'
import { firstLetterSearch, fullWordSearch, getBanis } from './lib/db'
import Updater from './lib/Updater'
import settings from './lib/settings'
import logger from './lib/logger'
import { handleError } from './lib/error'
import {
  PORT,
  CUSTOM_THEMES_FOLDER,
  CUSTOM_OVERLAY_THEMES_FOLDER,
  HISTORY_FILE,
  UPDATE_TMP_FOLDER,
  UPDATE_CHECK_INTERVAL,
  FRONTEND_BUILD_FOLDER,
  FRONTEND_THEMES_FOLDER,
  isDev,
} from './lib/consts'
import { ensureRequiredDirs, notify, sendToElectron } from './lib/utils'

import { version } from './package.json'


/**
 * Sets up updates.
 * @param {SessionManager} sessionManager An instance of sessionManager.
 */
const initialiseUpdater = sessionManager => {
  const updater = new Updater( {
    tempFolder: UPDATE_TMP_FOLDER,
    interval: UPDATE_CHECK_INTERVAL,
  } )

  // Display notification for 30s, with optional toast
  const notification = ( message, toast ) => {
    sessionManager.setStatus( message )
    if ( toast ) notify( message )
    setTimeout( () => sessionManager.setStatus(), 1000 * 30 )
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
    { prefix: '/themes', dir: FRONTEND_THEMES_FOLDER },
    { prefix: '/themes', dir: CUSTOM_THEMES_FOLDER },
    { prefix: '/themes/*', dir: join( FRONTEND_THEMES_FOLDER, 'Day.css' ) },
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
  const search = searchFn => async ( client, query ) => client.sendJSON( 'results', await searchFn( query ) )
  socket.on( 'search:first-letter', search( firstLetterSearch ) )
  socket.on( 'search:full-word', search( fullWordSearch ) )

  // Register Bani list requests on socket connection
  socket.on( 'connection', async client => client.sendJSON( 'banis:list', await getBanis() ) )

  // Start the server
  server.listen( PORT, () => {
    sendToElectron( 'ready' )
    logger.info( `Running express API server on port ${PORT}` )
  } )

  // When settings change, notify Electron
  settings.on( 'change', settings => sendToElectron( 'settings', settings ) )

  // Check for updates every 5 minutes, in production only
  if ( !isDev ) initialiseUpdater( sessionManager )
}

process.on( 'uncaughtException', handleError )

export default main().catch( handleError )
