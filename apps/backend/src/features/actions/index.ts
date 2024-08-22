import { LOG_FOLDER, USER_OVERLAY_THEMES_FOLDER } from '@presenter/node'
import open from 'open'

import ipc from '~/services/ipc'
import { SocketServer } from '~/services/websocket-server'

type ActionsModuleOptions = {
  socketServer: SocketServer,
}

const createActionsModule = ( { socketServer }: ActionsModuleOptions ) => {
  socketServer.on( 'action:open-overlay-folder', () => void open( USER_OVERLAY_THEMES_FOLDER ) )
  socketServer.on( 'action:open-logs-folder', () => void open( LOG_FOLDER ) )
  socketServer.on( 'action:open-window', () => ipc.send( 'action:open-window', undefined ) )
  socketServer.on( 'action:open-external-url', ( url: string ) => void open( url ) )
}

export default createActionsModule
