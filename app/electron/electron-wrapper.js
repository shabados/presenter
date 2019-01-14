// eslint-disable-next-line
import { app, BrowserWindow } from 'electron'
import logger from 'electron-log'
import fetch from 'electron-fetch'

const { env } = process
const PORT = env.NODE_ENV === 'production' ? 42424 : 42425

const BASE_URL = `http://localhost:${PORT}`

let mainWindow

/**
 * Loads the Shabad OS web page, if available.
 * Uses server heartbeat to determine whether server is ready yet.
 */
const loadPage = () => fetch( `${BASE_URL}/heartbeat` )
  .then( () => {
    mainWindow.loadURL( BASE_URL )
    // Open the DevTools.
    mainWindow.webContents.openDevTools()
    mainWindow.maximize()
    mainWindow.show()
  } )
  .catch( () => setTimeout( loadPage, 300 ) )

/**
 * Creates a browser window.
 */
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow( { show: false } )

  // Load the web page
  loadPage()

  mainWindow.on( 'closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  } )
}

app.on( 'ready', createWindow )

// Quit when all windows are closed.
app.on( 'window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if ( process.platform !== 'darwin' ) {
    app.quit()
  }
} )

app.on( 'activate', () => {
  if ( mainWindow === null ) {
    createWindow()
  }
} )

// Catch any errors
//! Should catch port in use separately, means shabad os is likely already running
process.on( 'uncaughtException', error => {
  // Log it
  logger.error( error )

  process.exit( 1 )
} )
