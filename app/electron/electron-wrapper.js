// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, screen } from 'electron'

import logger from '../lib/logger'
import { PORT, isDev } from '../lib/consts'
import settings from '../lib/settings'

const BASE_URL = !isDev ? `http://localhost:${PORT}` : `http://localhost:${3000}`

let mainWindow

/**
 * Loads the Shabad OS web page, if available.
 * Uses server heartbeat to determine whether server is ready yet.
 */
const loadPage = window => {
  window.loadURL( BASE_URL )

  window.on( 'ready-to-show', () => {
    window.setMenuBarVisibility( isDev )
    window.maximize()
    window.show()
  } )
}

/**
 * Creates a browser window.
 */
function createWindows() {
  // Create the browser window.
  mainWindow = new BrowserWindow( { show: false } )

  // Load the web page
  loadPage( mainWindow )

  // Quit when main window is closed
  mainWindow.on( 'closed', () => {
    mainWindow = null
    app.quit()
  } )

  mainWindow.on( 'ready-to-show', () => mainWindow.focus() )

  // Spin up displays on the non-main window
  if ( settings.get( 'system.multipleDisplays' ) ) {
    screen
      .getAllDisplays()
      .map( ( { bounds: { x, y } } ) => ( { x, y } ) )
      .filter( ( { x, y } ) => x !== 0 || y !== 0 )
      .map( ( { x, y } ) => {
        const window = new BrowserWindow( { x, y, show: false } )
        loadPage( window )

        return window
      } )
  }
}

// Catch any errors
//! Should catch port in use separately, means shabad os is likely already running
process.on( 'uncaughtException', error => {
  // Log it
  logger.error( error )

  process.exit( 1 )
} )

// Handlers for server IPC events
const handlers = {
  ready: () => () => createWindows(),
}

// Register handlers from server IPC
module.exports = server => {
  server.on( 'message', ( { event, payload } ) => {
    const handler = handlers[ event ] || ( () => () => {} )
    handler( server )( payload )
  } )
}
