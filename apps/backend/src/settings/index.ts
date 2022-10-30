import createSocketServer from '../services/socket-server'
import createGlobalSettings from './global'
import createSettingsState from './state'

type SettingsModuleOptions = {
  socketServer: ReturnType<typeof createSocketServer>,
}

const createSettingsModule = ( { socketServer }: SettingsModuleOptions ) => {
  const globalSettings = createGlobalSettings()
  const state = createSettingsState( { globalSettings } )

  const { getClientSettings, publicSettings } = state

  socketServer.on( 'connection:ready', ( { sendJSON, host } ) => sendJSON( 'settings:all', getClientSettings( host ) ) )

  socketServer.on( 'settings:all', state.setSettings )

  publicSettings.onChange( () => socketServer.broadcast( 'settings:all', ( { host } ) => getClientSettings( host ) ) )

  return state
}

export default createSettingsModule
