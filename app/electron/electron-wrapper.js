// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'

import logger from '../lib/logger'
import { isDev } from '../lib/consts'

import { createMainWindow, createNonMainWindows, closeNonMainWindows, createWindow, createSplashScreen, getMainWindow } from './window'
import { setBeta, initUpdates, checkUpdates } from './updates'

let splashScreen

app.on( 'ready', () => {
  logger.info( 'Starting Electron Shell' )

  logger.info( 'Loading splashscreen' )
  splashScreen = createSplashScreen()
} )

const onSettingsChange = ( { system } ) => {
  // Toggle multiple displays
  if ( system.multipleDisplays ) createNonMainWindows()
  else closeNonMainWindows()

  // Ensure updater beta settings are in sync
  setBeta( system.betaOptIn )
}

const onServerReady = server => {
  // Set up the update loop
  initUpdates( server )

  // Create the main window
  createMainWindow()

  // Close splashscreen when the main window has been shown
  getMainWindow().on( 'show', () => splashScreen.close() )
}

// Catch any errors
//! Should catch port in use separately, means shabad os is likely already running
process.on( 'uncaughtException', error => {
  // Log it
  logger.error( error )

  process.exit( 1 )
} )

//! Random 5 second timeout before trying to connect to server
if ( isDev ) {
  app.on( 'ready', () => setTimeout( () => {
    onServerReady()
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = require( 'electron-devtools-installer' )

    installExtension( REACT_DEVELOPER_TOOLS )

    // Pretend setting updates are sent over
    setInterval( async () => {
      // eslint-disable-next-line global-require
      const settings = require( '../lib/settings' ).default
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

// Register handlers from server IPC
module.exports = server => {
  server.on( 'message', ( { event, payload } ) => {
    const handler = handlers[ event ] || ( () => () => {} )
    handler( server )( payload )
  } )
}
