// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow } from 'electron'
import fetch from 'electron-fetch'

import logger from '../lib/logger'
import { PORT, isDev } from '../lib/consts'

const BASE_URL = !isDev ? `http://localhost:${PORT}` : `http://localhost:${3000}`

let mainWindow

/**
 * Loads the Shabad OS web page, if available.
 * Uses server heartbeat to determine whether server is ready yet.
 */
const loadPage = () => fetch( `${BASE_URL}/heartbeat` )
  .then( () => mainWindow.loadURL( BASE_URL ) )
  .catch( () => setTimeout( loadPage, 300 ) )

/**
 * Creates a browser window.
 */
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow( { show: false } )

  // Load the web page
  loadPage()

  mainWindow.on( 'ready-to-show', () => {
    mainWindow.setMenuBarVisibility( isDev )
    mainWindow.maximize()
    mainWindow.show()
    mainWindow.focus()
  } )

  // Quit when main window is closed
  mainWindow.on( 'closed', () => {
    mainWindow = null
    app.quit()
  } )
}

app.on( 'ready', createWindow )

app.on( 'activate', () => {
  if ( mainWindow === null ) createWindow()
} )

// Catch any errors
//! Should catch port in use separately, means shabad os is likely already running
process.on( 'uncaughtException', error => {
  // Log it
  logger.error( error )

  process.exit( 1 )
} )
