// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, screen, Menu } from 'electron'
import { omit } from 'lodash'
import * as remote from '@electron/remote/main'

import { PORT, isDev } from '../lib/consts'

const BASE_URL = !isDev ? `http://localhost:${PORT}` : `http://localhost:${3000}`

let displayWindows = {}
let mainWindow = null

// Hide default menu in prod
if ( !isDev ) Menu.setApplicationMenu( null )

const fullScreenOnShow = window => window.maximize()

// Creates any browser window
export const createWindow = ( url, windowParams, onBeforeShow = () => {} ) => {
  const window = new BrowserWindow( {
    show: false,
    webPreferences: { nodeIntegration: true, contextIsolation: false },
    ...windowParams,
  } )
  remote.enable( window.webContents )
  window.setMenuBarVisibility( isDev )

  window.loadURL( url )

  window.on( 'ready-to-show', () => {
    onBeforeShow( window )
    window.show()
  } )

  return window
}

// Gets all displays, excluding the main by default
export const getOtherDisplays = ( excludeMain = true ) => {
  const displays = screen.getAllDisplays()

  return excludeMain
    ? displays.filter( ( { bounds: { x, y } } ) => x !== 0 || y !== 0 )
    : displays
}

// Creates and stores the "main" window, shown on the primary desktop
export const createMainWindow = () => {
  mainWindow = createWindow( BASE_URL, {}, fullScreenOnShow )
  mainWindow.on( 'closed', () => app.quit() )
  mainWindow.on( 'ready-to-show', () => mainWindow.focus() )
  displayWindows = { ...displayWindows, [ mainWindow.id ]: mainWindow }
}

// Creates windows for other displays, only if there's currently a single display
export const createNonMainWindows = () => Object.values( displayWindows ).length === 1
&& getOtherDisplays()
  .forEach( ( { bounds: { x, y } } ) => {
    const window = createWindow( BASE_URL, { x, y }, fullScreenOnShow )

    window.on( 'close', () => {
      displayWindows = omit( displayWindows, window.id )
    } )

    displayWindows = { ...displayWindows, [ window.id ]: window }
  } )

// Close the non-main windows
export const closeNonMainWindows = () => Object
  .entries( displayWindows )
  .filter( ( [ id ] ) => id != mainWindow.id ) // eslint-disable-line eqeqeq
  .forEach( ( [ , window ] ) => window.close() )

export const getMainWindow = () => mainWindow

export const getDisplayWindows = () => displayWindows

export const createSplashScreen = () => createWindow( `file://${__dirname}/splashscreen/index.html`, {
  width: 480,
  height: 270,
  frame: false,
} )
