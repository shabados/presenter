// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'

import logger from '../lib/logger'

import { createMainWindow, createNonMainWindows, closeNonMainWindows } from './window'
import { isDev } from '../lib/consts'


const onReady = () => {
  logger.info( 'Starting Electron Shell' )
  createMainWindow()
}

const onSettingsChange = ( { system } ) => {
  // Toggle multiple displays
  if ( system.multipleDisplays ) createNonMainWindows()
  else closeNonMainWindows()
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

    // Pretend setting updates are sent over
    setInterval( () => {
      // eslint-disable-next-line global-require
      const settings = require( '../lib/settings' ).default
      settings.loadSettings()

      onSettingsChange( settings.get() )
    }, 1000 )
  }, 5000 ) )
}

// Handlers for server IPC events
const handlers = {
  ready: () => () => ( app.isReady() ? onReady() : app.on( 'ready,', onReady ) ),
  settings: () => onSettingsChange,
}

// Register handlers from server IPC
module.exports = server => {
  server.on( 'message', ( { event, payload } ) => {
    const handler = handlers[ event ] || ( () => () => {} )
    handler( server )( payload )
  } )
}
