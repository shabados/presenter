// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import { autoUpdater } from 'electron-updater'

import logger from '../lib/logger'

let updateChannelSet = false
let installOnQuit = false

export const initUpdates = ( server ) => {
  autoUpdater.logger = logger
  autoUpdater.autoInstallOnAppQuit = false

  autoUpdater.on( 'update-available', ( info ) => server.send( { event: 'update-available', payload: info } ) )

  autoUpdater.on( 'update-downloaded', ( info ) => {
    server.send( { event: 'update-downloaded', payload: info } )

    // Do not register the will-quit event handler more than once
    if ( !installOnQuit ) {
      installOnQuit = true

      //* Override app handler to visually show installer
      app.on( 'will-quit', () => autoUpdater.quitAndInstall( false, false ) )
    }
  } )
}

export const checkUpdates = async ( server ) => {
  // Wait until the channel has been configured
  if ( !updateChannelSet ) {
    setTimeout( () => checkUpdates( server ), 1000 )
    return
  }

  logger.info( 'Checking for app updates, beta:', autoUpdater.allowPrerelease )

  await autoUpdater.checkForUpdates().catch( ( error ) => logger.error( 'Failed to check for update:', error ) )

  server.send( { event: 'update-checked' } )
}

export const setBeta = ( beta ) => {
  autoUpdater.allowPrerelease = beta
  updateChannelSet = true
}

//! Errors to supress according to https://github.com/electron-userland/electron-builder/issues/2398#issuecomment-413117520
export const UPDATER_ERRORS = [
  'net::ERR_INTERNET_DISCONNECTED',
  'net::ERR_PROXY_CONNECTION_FAILED',
  'net::ERR_CONNECTION_RESET',
  'net::ERR_CONNECTION_CLOSE',
  'net::ERR_NAME_NOT_RESOLVED',
  'net::ERR_CONNECTION_TIMED_OUT',
  'net::ERR_HTTP_RESPONSE_CODE_FAILURE',
]
