import { ensureAppFolders, getLogger } from '@presenter/node'

import { version } from '../package.json'
import createActionsModule from './actions'
import createContentModule from './content'
import createDiagnosticsModule from './diagnostics'
import { handleError } from './error'
import createHistoryModule from './history'
import createSearchModule from './search'
import createExpress from './services/express'
import createGlobalSettings from './services/global-settings'
import ipc from './services/ipc'
import createUpdater from './services/updater'
import createWebSocketServer from './services/websocket-server'
import createSettingsModule from './settings'
import createStatusModule from './status'
import createThemesModule from './themes'

const log = getLogger( 'main' )

const main = async () => {
  log.info( `Starting Shabad OS ${version}` )

  await ensureAppFolders()

  ipc.registerListener()

  const globalSettings = createGlobalSettings()
  await globalSettings.load()

  const updater = createUpdater( { globalSettings } )

  const { httpServer, api, listen } = createExpress()
  const socketServer = createWebSocketServer( { httpServer } )

  createSettingsModule( { socketServer, globalSettings } )
  createSearchModule( { socketServer } )
  createActionsModule( { socketServer } )
  createStatusModule( { socketServer, globalSettings, updater } )
  await createThemesModule( { api } )
  createDiagnosticsModule( { api } )
  const history = createHistoryModule( {} )
  createContentModule( { api, socketServer, history } )

  listen()

  updater.start()
}

process.on( 'uncaughtException', handleError )
process.on( 'unhandledRejection', handleError )

main().catch( handleError )
