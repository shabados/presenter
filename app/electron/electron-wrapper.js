// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'

import logger from '../lib/logger'
import { isDev } from '../lib/consts'

import { createMainWindow, createNonMainWindows, closeNonMainWindows } from './window'
import { setBeta, initUpdates, checkUpdates } from './updates'


const onSettingsChange = ( { system } ) => {
  // Toggle multiple displays
  if ( system.multipleDisplays ) createNonMainWindows()
  else closeNonMainWindows()

  // Ensure updater beta settings are in sync
  setBeta( system.betaOptIn )
}

const onReady = server => {
  logger.info( 'Starting Electron Shell' )
  initUpdates( server )
  createMainWindow()
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
    onReady()
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
  ready: server => () => ( app.isReady() ? onReady( server ) : app.on( 'ready,', () => onReady( server ) ) ),
  settings: () => onSettingsChange,
  'update-check': server => () => checkUpdates( server ),
}

// Register handlers from server IPC
module.exports = server => {
  server.on( 'message', ( { event, payload } ) => {
    const handler = handlers[ event ] || ( () => () => {} )
    handler( server )( payload )
  } )
}
