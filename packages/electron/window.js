// eslint-disable-next-line import/no-extraneous-dependencies
import { app, BrowserWindow, screen, Menu, ipcMain } from 'electron'
import { fileURLToPath } from 'url'
import omit from 'lodash/omit.js'

import { PORT, isDev } from '@shabados/backend/lib/consts.js'

const PRELOAD_PATH = fileURLToPath( new URL( 'preload.cjs', import.meta.url ) )

const BASE_URL = !isDev ? `http://localhost:${PORT}` : `http://localhost:${3000}`

let displayWindows = {}
let mainWindow = null

// Fullscreen toggle requested from the renderer via the preload bridge
ipcMain.on( 'toggle-fullscreen', ( { sender } ) => {
  const window = BrowserWindow.fromWebContents( sender )
  if ( window ) window.setFullScreen( !window.isFullScreen() )
} )

// Hide default menu in prod
if ( !isDev ) Menu.setApplicationMenu( null )

const fullScreenOnShow = window => window.maximize()

// Creates any browser window
export const createWindow = ( url, windowParams, onBeforeShow = () => {} ) => {
  const window = new BrowserWindow( {
    show: false,
    webPreferences: { contextIsolation: true, preload: PRELOAD_PATH },
    ...windowParams,
  } )
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

export const createSplashScreen = version => createWindow( `${new URL( 'splashscreen/index.html', import.meta.url ).href}?version=${version}`, {
  width: 480,
  height: 270,
  frame: false,
} )
