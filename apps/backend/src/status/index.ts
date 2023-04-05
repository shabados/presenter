import { GlobalSettings } from '../services/global-settings'
import { SocketServer } from '../services/socket-server'
import { Updater } from '../services/updater'
import createStatusState from './state'

type StatusModuleOptions = {
  socketServer: SocketServer,
  globalSettings: GlobalSettings,
  updater: Updater,
}

const createStatusModule = ( {
  socketServer,
  globalSettings,
  updater,
}: StatusModuleOptions ) => {
  const { status, notifyStatus } = createStatusState()

  status.onChange( socketServer.broadcast( 'status' ) )

  socketServer.on( 'connection:ready', ( client ) => {
    if ( !globalSettings.get().notifications.connectionEvents ) return

    notifyStatus( `${client.host} connected`, 1000 * 3 )
  } )

  socketServer.on( 'disconnection', ( client ) => {
    if ( !globalSettings.get().notifications.disconnectionEvents ) return

    notifyStatus( `${client.host} disconnected`, 1000 * 3 )
  } )

  updater.on( 'application:updating', () => {
    if ( !globalSettings.get().notifications.downloadEvents ) return

    notifyStatus( 'Downloading app update' )
  } )

  updater.on( 'application:updated', () => {
    if ( !globalSettings.get().notifications.downloadedEvents ) return

    notifyStatus( 'Close to install app update' )
  } )

  updater.on( 'database:updating', () => {
    if ( !globalSettings.get().notifications.downloadEvents ) return

    notifyStatus( 'Downloading database update' )
  } )

  updater.on( 'database:updated', () => {
    if ( !globalSettings.get().notifications.downloadedEvents ) return

    notifyStatus( 'Database updated' )
  } )

  socketServer.on( 'connection:ready', ( client ) => client.sendJSON( 'status', status.get() ) )
}

export default createStatusModule
