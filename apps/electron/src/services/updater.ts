// eslint-disable-next-line import/no-extraneous-dependencies
import { ChildProcess } from 'node:child_process'

import { getLogger, mutableValue } from '@presenter/node'
import { app } from 'electron'
import { autoUpdater } from 'electron-updater'

const log = getLogger( 'updater' )

const createUpdater = ( server: ChildProcess ) => {
  const updateChannelSet = mutableValue( false )
  const installOnQuit = mutableValue( false )

  autoUpdater.logger = log
  autoUpdater.autoInstallOnAppQuit = false

  autoUpdater.on( 'update-available', ( info ) => server.send( { event: 'update-available', payload: info } ) )

  autoUpdater.on( 'update-downloaded', ( info ) => {
    server.send( { event: 'update-downloaded', payload: info } )

    // Do not register the will-quit event handler more than once
    if ( !installOnQuit.get() ) {
      installOnQuit.set( true )

      //* Override app handler to visually show installer
      app.on( 'will-quit', () => autoUpdater.quitAndInstall( false, false ) )
    }
  } )

  const check = () => {
  // Wait until the channel has been configured
    if ( !updateChannelSet.get() ) {
      setTimeout( check, 1000 )
      return
    }

    log.info( 'Checking for app updates, beta:', autoUpdater.allowPrerelease )

    autoUpdater.checkForUpdates()
      .then( () => server.send( { event: 'update-checked' } ) )
      .catch( ( error ) => log.error( 'Failed to check for update:', error ) )
  }

  const setBeta = ( beta: boolean ) => {
    autoUpdater.allowPrerelease = beta
    updateChannelSet.set( true )
  }

  return { setBeta, check }
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
