import { GlobalSettings } from '~/services/global-settings'
import { Updater } from '~/services/updater'
import { SocketServer } from '~/services/websocket-server'

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

  socketServer.on( 'client:connected', ( { host } ) => {
    if ( !globalSettings.get().notifications.connectionEvents ) return

    notifyStatus( `${host} connected`, 1000 * 3 )
  } )

  socketServer.on( 'client:disconnected', ( { host } ) => {
    if ( !globalSettings.get().notifications.disconnectionEvents ) return

    notifyStatus( `${host} disconnected`, 1000 * 3 )
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

  socketServer.on( 'client:connected', ( { json } ) => json( 'status', status.get() ) )
}

export default createStatusModule
