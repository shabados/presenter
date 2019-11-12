// eslint-disable-next-line import/no-extraneous-dependencies
import { app } from 'electron'
import { autoUpdater } from 'electron-updater'

import logger from '../lib/logger'

export const initUpdates = server => {
  autoUpdater.logger = logger
  autoUpdater.autoInstallOnAppQuit = false

  autoUpdater.on( 'update-available', info => server.send( { event: 'update-available', payload: info } ) )

  autoUpdater.on( 'update-downloaded', info => {
    server.send( { event: 'update-downloaded', payload: info } )

    //* Override app handler to visually show installer
    app.on( 'will-quit', event => {
      event.preventDefault()
      autoUpdater.quitAndInstall( false, false )
    } )
  } )
}

export const checkUpdates = async server => {
  logger.info( 'Checking for app updates, beta:', autoUpdater.allowPrerelease )

  await autoUpdater.checkForUpdates().catch( logger.error )

  server.send( { event: 'update-checked' } )
}

export const setBeta = beta => { autoUpdater.allowPrerelease = beta }
