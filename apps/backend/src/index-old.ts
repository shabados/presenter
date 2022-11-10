import { isShabad } from '@presenter/contract/src/data'
import {
  ensureAppFolders,
  getLogger,
  HISTORY_FILE,
  isProduction,
  LOG_FOLDER,
  UPDATE_TMP_FOLDER,
} from '@presenter/node'
import open from 'open'
import { join } from 'path'

import { version } from '../package.json'
import api from './api'
import { handleError } from './error'
import {
  FRONTEND_BUILD_FOLDER,
  UPDATE_CHECK_INTERVAL,
} from './helpers/consts'
import analytics from './services/analytics'
import { getBanis } from './services/database'
import createExpress from './services/express'
import ipc from './services/ipc'
import createSocketServer, { SocketClient, SocketServer } from './services/socket-server'
import createState, { State } from './services/state'
import createUpdater from './services/updater'
import createZoom from './services/zoom'
import createSettingsModule from './settings'
import createSettings from './settings'

const log = getLogger( 'main' )

const main = async () => {
  log.info( `Starting Shabad OS ${version}` )

  process.on( 'uncaughtException', handleError() )
  process.on( 'unhandledRejection', handleError( false ) )

  const settings = createSettings( { socketServer } )

  await ensureAppFolders()

  await settings.load()

  const initialiseUpdater = ( state: State ) => {
    const updater = createUpdater( {
      tempFolder: UPDATE_TMP_FOLDER,
      interval: UPDATE_CHECK_INTERVAL,
    } )

    const notification = ( message: string, shouldToast: boolean ) => {
      if ( !shouldToast ) return

      state.notifyStatus( message )
    }

    updater.on( 'database:updating', () => notification( 'Downloading database update', settings.get().notifications.downloadEvents ) )
    updater.on( 'database:updated', () => notification( 'Database updated', settings.get().notifications.downloadedEvents ) )

    updater.on( 'application:updating', () => notification( 'Downloading app update', settings.get().notifications.downloadEvents ) )
    updater.on( 'application:updated', () => notification( 'Close to install app update', settings.get().notifications.downloadedEvents ) )

    updater.start()
  }

  const mounts = [
    { prefix: '/', dir: FRONTEND_BUILD_FOLDER },
    { prefix: '/history.csv', dir: HISTORY_FILE },
    { prefix: '*', dir: join( FRONTEND_BUILD_FOLDER, 'index.html' ) },
  ] as Mount[]

  const onConnection = ( {
    bani,
    shabad,
    history,
    lineId,
    mainLineId,
    nextLineId,
    viewedLines,
    status,
    settings: stateSettings,
    getClientSettings,
    notifyStatus,
  }: State ) => ( client: SocketClient ) => {
    if ( settings.get().notifications.connectionEvents ) notifyStatus( `${client.host} connected`, 1000 * 3 )

    if ( bani.get() ) client.sendJSON( 'banis:current', bani.get() )
    else client.sendJSON( 'shabads:current', shabad.get() )
    void getBanis().then( ( banis ) => client.sendJSON( 'banis:list', banis ) )
    client.sendJSON( 'lines:current', lineId.get() )
    client.sendJSON( 'history:viewed-lines', viewedLines.get() )
    client.sendJSON( 'lines:main', mainLineId.get() )
    client.sendJSON( 'lines:next', nextLineId.get() )
    client.sendJSON( 'status', status.get() )
    client.sendJSON( 'history:transitions', history.getTransitionsOnly() )
    client.sendJSON( 'history:latest-lines', history.getLatestLines() )
  }

  const registerStateHandlers = ( state: State, socket: Socket ) => {
    socket.on( 'shabads:current', this.onShabad.bind( this ) )
    socket.on( 'lines:current', this.onLine.bind( this ) )
    socket.on( 'lines:main', this.onMainLine.bind( this ) )
    socket.on( 'lines:next', this.onNextLine.bind( this ) )
    socket.on( 'history:clear', this.onClearHistory.bind( this ) )
    socket.on( 'banis:current', this.onBani.bind( this ) )
    socket.on( 'settings:all', this.onSettings.bind( this ) )
  }
  const onDisconnection = (
    { getClientSettings, notifyStatus }: State,
    socketServer: SocketServer,
  ) => ( { host }: SocketClient ) => {
    if ( settings.get().notifications.disconnectionEvents ) notifyStatus( `${host} disconnected`, 1000 * 3 )

    // TODO do we need this???
    // Remove the settings of the client only if there are no other connections
    if ( !Array.from( socketServer.clients ).some( ( client ) => client.host === host ) ) {
      this.session = { ...this.session, settings: omit( this.session.settings, host ) }
    }

    // Rebroadcast settings on disconnection
    socketServer.clients.forEach( ( client ) => client.sendJSON( 'settings:all', getClientSettings( client.host ) ) )
  }

  ipc.registerListener()

  analytics.initialise()

  // START
  const httpServer = createExpress( api, mounts )
  const socketServer = createSocketServer( { httpServer } )

  createSettingsModule( { socketServer } )

  const state = createState()

  socketServer.on( 'connection', onConnection( state ) )
  socketServer.on( 'disconnection', onDisconnection( state, socketServer ) )
  socketServer.on( 'shabads:current', this.onShabad.bind( this ) )
  socketServer.on( 'lines:current', this.onLine.bind( this ) )
  socketServer.on( 'lines:main', this.onMainLine.bind( this ) )
  socketServer.on( 'lines:next', this.onNextLine.bind( this ) )
  socketServer.on( 'history:clear', this.onClearHistory.bind( this ) )
  socketServer.on( 'banis:current', this.onBani.bind( this ) )
  socketServer.on( 'settings:all', this.onSettings.bind( this ) )

  const zoom = createZoom()

  state.lineId.onChange( ( id ) => {
    const content = state.content.get()

    void zoom.sendLine( {
      shabad: isShabad( content ) ? content : undefined,
      line: id ? state.lines.get()[ id ] : undefined,
    } )
  } )

  state.publicSettings.onChange( () => socketServer.clients.forEach( ( client ) => client.sendJSON( 'settings:all', state.getClientSettings( client.host ) ) ) )

  socketServer.onConnection( ( client ) => getBanis().then( ( banis ) => client.sendJSON( 'banis:list', banis ) ) )

  settings.onChange( ( settings ) => ipc.send( 'settings:change', settings ) )

  if ( isProduction ) initialiseUpdater( state )

  await zoom.initialise()
}

export default main().catch( handleError() )
