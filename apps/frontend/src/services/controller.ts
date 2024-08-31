import EventEmitter from 'eventemitter3'
import ReconnectingWebSocket from 'reconnecting-websocket'

import { getNextJumpLine } from '~/helpers/auto-jump'
import { isDev, isElectron, WS_URL } from '~/helpers/consts'
import { findLineIndex } from '~/helpers/line'
import { ClientSettings, DEFAULT_OPTIONS, SettingsState } from '~/helpers/options'
import { merge } from '~/helpers/utils'

type ShabadOptions = {
  shabadId?: string,
  lineId?: string | null,
  shabadOrderId: number | null,
  lineOrderId: number | null,
}

class Controller extends EventEmitter {
  #socket: ReconnectingWebSocket
  #settings: SettingsState

  constructor() {
    super()

    // Setup WebSocket connection to server
    this.#socket = new ReconnectingWebSocket( WS_URL, undefined, {
      reconnectionDelayGrowFactor: 1,
      minReconnectionDelay: 300 + Math.random() * 200,
      connectionTimeout: 1000,
    } )

    // Initialise settings
    this.saveLocalSettings()
    this.#settings = { local: this.readSettings( true ) } as any

    this.#socket.addEventListener( 'close', this.onClose )
    this.#socket.addEventListener( 'message', this.onMessage )
    this.#socket.addEventListener( 'open', this.onOpen )

    this.on( 'ready', this.onReady )
  }

  sendJSON = ( event: string, payload?: any ) => {
    const sendJSON = () => this.#socket.send( JSON.stringify( { event, payload } ) )

    if ( this.#socket.readyState === 1 ) sendJSON()
    else this.once( 'connected', sendJSON )
  }

  onOpen = () => {
    console.log( 'Connected to server' )
    this.emit( 'connected' )
  }

  onReady = () => {
    this.once( 'settings:all', ( { local = {}, ...rest } ) => {
      // Transmit our local settings if the server does not have a copy
      const doSyncSettings = !Object.keys( local ).length

      if ( doSyncSettings ) this.setSettings()

      // Hook normal settings event handler
      this.on( 'settings:all', this.onSettings )

      this.emit( 'settings:all', {
        local: doSyncSettings ? this.#settings.local : local,
        ...rest,
      } )
    } )
  }

  onClose = () => {
    this.off( 'settings:all', this.onSettings )
    console.log( 'Disconnected from server' )
    this.emit( 'disconnected' )
  }

  /**
  essage = ( { data }: { data: any } ) => {
    const { event, payload } = JSON.parse( data )
    this.emit( event, payload )
  }

  onSettings = ( settings: SettingsState ) => {
    this.#settings = settings
    this.emit( 'settings', settings )
  }

  /**
   * Convenience method for searching.
   * @param query The first letters to search with.
   * @param type The type of search (first-letter/full-word).
   * @param options Additional options to pass.
   */
  search = ( query: string, type: string, options = {} ) => this.sendJSON( `search:${type}`, { ...options, query } )

  line = ( lineId: string ) => this.sendJSON( 'lines:current', { lineId } )

  mainLine = ( lineId: string ) => this.sendJSON( 'lines:main', lineId )

  nextJumpLine = ( lineId: string ) => this.sendJSON( 'lines:next', lineId )

  clear = () => this.sendJSON( 'lines:current', { lineId: null } )

  clearHistory = () => this.sendJSON( 'history:clear' )

  getBanis = () => this.sendJSON( 'banis:list' )

  bani = ( { baniId, lineId = null }: any ) => this.sendJSON( 'banis:current', { baniId, lineId } )

  // eslint-disable-next-line class-methods-use-this
  readSettings = ( onlyOverrides = false ): Partial<ClientSettings> => {
    try {
      const localSettings = JSON.parse( localStorage.getItem( 'settings' ) ?? '' )
      return onlyOverrides ? localSettings : merge( DEFAULT_OPTIONS.local, localSettings )
    } catch ( err ) {
      console.warn( 'Settings corrupted. Resetting to default.', err )
      return onlyOverrides ? {} : DEFAULT_OPTIONS.local
    }
  }

  saveLocalSettings = ( settings: Partial<ClientSettings> = {}, combine = true ) => {
    const local = combine ? merge( this.readSettings( true ), settings ) : settings

    localStorage.setItem( 'settings', JSON.stringify( local ) )
  }

  setSettings = ( changed = {}, host = 'local', combine = true ) => {
    let settings = {}
    if ( host === 'local' ) {
      this.saveLocalSettings( changed, combine )

      settings = { local: this.readSettings( true ) }

      this.emit( 'settings', settings )
    } else {
      settings = { [ host ]: combine ? merge( this.#settings[ host ], changed ) : changed }
    }

    // Transmit all settings
    this.sendJSON( 'settings:all', settings )
  }

  action = ( name: string, params: any ) => this.sendJSON( `action:${name}`, params )

  openWindow = isElectron && !isDev
    ? ( url: string, params: any ) => this.action( 'open-window', { url: `${window.location.origin}${url}`, ...params } )
    : ( url: string ) => window.open( url )

  openExternalUrl = isElectron
    ? ( url: string ) => this.action( 'open-external-url', url )
    : ( url: string ) => window.open( url )

  resetSettings = ( host = 'local' ) => {
    localStorage.setItem( 'settings', '{}' )
    this.setSettings( {}, host, false )
  }

  resetSettingGroup = ( group: keyof ClientSettings, host = 'local' ) => {
    const { [ group ]: _, ...settings } = this.#settings[ host ]
    this.setSettings( settings, host, false )
  }
}

// Allow only one instance by exporting it
export default new Controller()
