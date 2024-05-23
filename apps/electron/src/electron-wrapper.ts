import { ChildProcess } from 'node:child_process'

import * as remote from '@electron/remote/main'
import { createIpc, ElectronIpcEvents, getLogger, isDevelopment, ServerIpcEvents } from '@presenter/node'
// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'

// import { version } from '../../../app/package.json'
import initMenu from './browser/menu'
import { closeNonMainWindows, createMainWindow, createNonMainWindows, createSplashScreen, createWindow, getDisplayWindows, getMainWindow } from './browser/window'
import { checkUpdates, initUpdates, setBeta, UPDATER_ERRORS } from './services/updater'

const log = getLogger( 'main' )

let splashScreen

remote.initialize()

app.on( 'ready', () => {
  log.info( 'Starting Electron Shell' )

  log.info( 'Loading splashscreen' )
  splashScreen = createSplashScreen()
  splashScreen.globals = {
    version,
  }
} )

const onSettingsChange = ( { system } ) => {
  const windows = getDisplayWindows()
  Object.values( windows ).forEach( ( window ) => window.once( 'ready-to-show', () => {
    window.setSimpleFullScreen( system.fullscreenOnLaunch )
  } ) )

  // Toggle multiple displays
  if ( system.multipleDisplays ) createNonMainWindows()
  else closeNonMainWindows()

  // Ensure updater beta settings are in sync
  setBeta( system.betaOptIn )
}

//! Random 5 second timeout before trying to connect to server
if ( isDevelopment ) {
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
  settings: () => onSettingsChange,
  'update-check': ( server ) => () => checkUpdates( server ),
  'open-window': () => ( { url, ...params } ) => url && createWindow( url, params ),
}

// Register handlers from server IPC
const main = async ( server: ChildProcess ) => {
  const ipc = createIpc<ServerIpcEvents, ElectronIpcEvents>( server )

  const onServerReady = () => {
    // Set up the update loop
    initUpdates( server )
    // Setup menu - fixes macos global hotkey issue
    initMenu()
    // Create the main window
    createMainWindow()
    // Close splashscreen when the main window has been shown
    getMainWindow().once( 'show', () => splashScreen.close() )
  }

  ipc.on( 'server:ready', () => app.whenReady().then( onServerReady ) )
  ipc.on( 'settings:change', onSettingsChange )
  ipc.on( 'electron-update:check', checkUpdates )

  ipc.registerListener()
}

process.on( 'uncaughtException', ( error ) => {
  log.error( error )

  if ( UPDATER_ERRORS.includes( error.message ) ) return

  process.exit( 1 )
} )

export default main
