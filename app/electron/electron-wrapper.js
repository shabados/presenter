// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'

import logger from '../lib/logger.js'
import { isDev } from '../lib/consts.js'
import { createMainWindow, createNonMainWindows, closeNonMainWindows, createWindow, createSplashScreen, getMainWindow, getDisplayWindows } from './window.js'
import { setBeta, initUpdates, checkUpdates, UPDATER_ERRORS } from './updates.js'
import initMenu from './menu.js'
import pkg from '../package.json' with { type: 'json' }
const { version } = pkg

let splashScreen

app.on( 'ready', () => {
  logger.info( 'Starting Electron Shell' )

  logger.info( 'Loading splashscreen' )
  splashScreen = createSplashScreen( version )
} )

const onSettingsChange = ( { system } ) => {
  // Fullscreen any display windows on start, if set
  const windows = getDisplayWindows()
  Object.values( windows ).forEach( window => window.once( 'ready-to-show', () => {
    window.setSimpleFullScreen( system.fullscreenOnLaunch )
  } ) )

  // Toggle multiple displays
  if ( system.multipleDisplays ) createNonMainWindows()
  else closeNonMainWindows()

  // Ensure updater beta settings are in sync
  setBeta( system.betaOptIn )
}

const onServerReady = server => {
  // Set up the update loop
  initUpdates( server )
  // Setup menu - fixes macos global hotkey issue
  initMenu()
  // Create the main window
  createMainWindow()
  // Close splashscreen when the main window has been shown
  getMainWindow().once( 'show', () => splashScreen.close() )
}

//! Random 5 second timeout before trying to connect to server
if ( isDev ) {
  app.on( 'ready', () => setTimeout( async () => {
    onServerReady()
    const { installExtension, REACT_DEVELOPER_TOOLS } = await import( 'electron-devtools-installer' )

    installExtension( REACT_DEVELOPER_TOOLS )

    setInterval( async () => {
      const settings = ( await import( '../lib/settings.js' ) ).default
      await settings.loadSettings()

      onSettingsChange( settings.get() )
    }, 1000 )
  }, 5000 ) )
}

// Handlers for server IPC events
const handlers = {
  ready: server => () => ( app.isReady() ? onServerReady( server ) : app.on( 'ready,', () => onServerReady( server ) ) ),
  settings: () => onSettingsChange,
  'update-check': server => () => checkUpdates( server ),
  'open-window': () => ( { url, ...params } ) => url && createWindow( url, params ),
}

export default server => {
  if ( !server ) return
  server.on( 'message', ( { event, payload } ) => {
    const handler = handlers[ event ] || ( () => () => {} )
    handler( server )( payload )
  } )
}

process.on( 'uncaughtException', error => {
  logger.error( error )

  if ( UPDATER_ERRORS.includes( error.message ) ) return

  process.exit( 1 )
} )
