/**
 * Simple EventEmitter-based controller.
 * @ignore
 */

import ReconnectingWebSocket from 'reconnecting-websocket'
import EventEmitter from 'event-emitter'
import { toAscii } from 'gurmukhi-utils'

import { DEFAULT_OPTIONS } from './options'
import { merge, getNextJumpLine, findLineIndex } from './utils'
import { WS_URL, isElectron, isDev } from './consts'
import analytics from './analytics'

class Controller extends EventEmitter {
  constructor() {
    super()

    // Setup WebSocket connection to server
    this.socket = new ReconnectingWebSocket( WS_URL, null, {
      reconnectionDelayGrowFactor: 1,
      minReconnectionDelay: 300 + Math.random() * 200,
      connectionTimeout: 1000,
    } )

    // Initialise settings
    this.saveLocalSettings()
    this.settings = { local: this.readSettings( true ) }

    this.socket.addEventListener( 'close', this.onClose )
    this.socket.addEventListener( 'message', this.onMessage )
    this.socket.addEventListener( 'open', this.onOpen )

    this.on( 'ready', this.onReady )
  }

  /**
   * Sends a payload with a name to the server.
   * @param event The event name.
   * @param payload The JSON data to send.
   */
  sendJSON = ( event, payload ) => {
    const sendJSON = () => this.socket.send( JSON.stringify( { event, payload } ) )

    if ( this.socket.readyState === 1 ) sendJSON()
    else this.once( 'connected', sendJSON )
  }

  /**
   * Called when the WebSocket is connected.
   * @private
   */
  onOpen = () => {
    console.log( 'Connected to server' )
    this.emit( 'connected' )
  }


  /**
   * Called when the WebSocket is ready.
   * @private
   */
  onReady = () => {
    this.once( 'settings:all', ( { local = {}, ...rest } ) => {
      // Transmit our local settings if the server does not have a copy
      const doSyncSettings = !Object.keys( local ).length

      if ( doSyncSettings ) this.setSettings()

      // Hook normal settings event handler
      this.on( 'settings:all', this.onSettings )

      this.emit( 'settings:all', {
        local: doSyncSettings ? this.settings.local : local,
        ...rest,
      } )
    } )
  }

  /**
   * Called when the WebSocket is disconnected.
   * @private
   */
  onClose = () => {
    this.off( 'settings:all', this.onSettings )
    console.log( 'Disconnected from server' )
    this.emit( 'disconnected' )
  }

  /**
   * Called when the WebSocket receives a message.
   * @param data The data sent by the server.
   */
  onMessage = ( { data } ) => {
    const { event, payload } = JSON.parse( data )
    this.emit( event, payload )
  }

  onSettings = settings => {
    this.settings = settings
    this.emit( 'settings', settings )
  }

  /**
   * Convenience method for searching.
   * @param query The first letters to search with.
   * @param type The type of search (first-letter/full-word).
   */
  search = ( query, type ) => this.sendJSON( `search:${type}`, toAscii( query ) )

  /**
   * Convenience method for setting the line.
   * @param lineId The line id to change the display to.
   */
  line = lineId => this.sendJSON( 'lines:current', { lineId } )

  /**
   * Convenience method for setting the main line.
   * @param lineId The line id to change the display to.
   */
  mainLine = lineId => this.sendJSON( 'lines:main', lineId )

  nextJumpLine = lineId => this.sendJSON( 'lines:next', lineId )

  /**
   * Convenience method for setting the current shabad.
   * @param shabadId The shabad ID to change the server to.
   * @param lineId The line id to change the display to.
   */
  shabad = ( {
    shabadId,
    shabadOrderId = null,
    lineId = null,
    lineOrderId = null,
  } ) => this.sendJSON( 'shabads:current', {
    shabadId,
    shabadOrderId,
    lineId,
    lineOrderId,
  } )

  previousShabad = ( orderId, setLine = true ) => this.shabad( {
    shabadOrderId: orderId - 1,
    lineOrderId: setLine ? 1e20 : null,
  } )

  nextShabad = ( orderId, setLine = true ) => this.shabad( {
    shabadOrderId: orderId + 1,
    lineOrderId: setLine ? 0 : null,
  } )

  autoToggleShabad = ( { nextLineId, mainLineId, lineId, shabad: { lines } } ) => {
    if ( !mainLineId || !nextLineId || !lines ) return

    // Jump to main line and work out the new next line
    if ( lineId !== mainLineId ) {
      this.line( mainLineId )

      if ( !lineId ) return

      const currentLineIndex = findLineIndex( lines, lineId )

      // Set new next line to be the next line, bounded by the last line
      let nextLineIndex = Math.min(
        currentLineIndex + 1,
        lines.length - 1,
      )

      // Skip the main line if required, bounded by the last line
      nextLineIndex = Math.min(
        nextLineIndex + ( lines[ nextLineIndex ].id === mainLineId && 1 ),
        lines.length - 1,
      )

      const { id: newNextLineId } = lines[ nextLineIndex ]

      this.nextJumpLine( newNextLineId )
    } else this.line( nextLineId )
  }

  autoToggleBani = params => {
    const nextLineId = getNextJumpLine( params )
    if ( !nextLineId ) return

    this.line( nextLineId )
  }

  /**
   * Convenience method for clearing the line.
   */
  clear = () => this.sendJSON( 'lines:current', { lineId: null } )

  /**
   * Clears the current history for the session.
   */
  clearHistory = () => this.sendJSON( 'history:clear' )

  /**
   * Requests the latest list of banis from the server.
   */
  getBanis = () => this.sendJSON( 'banis:list' )

  /**
   * Sets the current Bani ID.
   * @param baniId The ID of the Bani to change to.
   */
  bani = ( { baniId, lineId = null } ) => this.sendJSON( 'banis:current', { baniId, lineId } )

  /**
   * Reads the settings from local storage, and combines with default settings.
   */
  readSettings = onlyOverrides => {
    try {
      const localSettings = JSON.parse( localStorage.getItem( 'settings' ) )
      return onlyOverrides ? localSettings : merge( DEFAULT_OPTIONS.local, localSettings )
    } catch ( err ) {
      console.warn( 'Settings corrupted. Resetting to default.', err )
      return onlyOverrides ? {} : DEFAULT_OPTIONS.local
    }
  }

  saveLocalSettings = ( settings = {}, combine = true ) => {
    const local = combine ? merge( this.readSettings( true ), settings ) : settings

    analytics.updateSettings( local )
    localStorage.setItem( 'settings', JSON.stringify( local ) )
  }

  /**
   * Stores any setting changes locally and submits changes to server.
   * @param changed The changed settings.
   * @param host The optional host to apply the settings to. Default of `local`.
   */
  setSettings = ( changed = {}, host = 'local', combine = true ) => {
    let settings = {}
    if ( host === 'local' ) {
      this.saveLocalSettings( changed, combine )

      settings = { local: this.readSettings( true ) }

      this.emit( 'settings', settings )
    } else {
      settings = { [ host ]: combine ? merge( this.settings[ host ], changed ) : changed }
    }

    // Transmit all settings
    this.sendJSON( 'settings:all', settings )
  }

  action = ( name, params ) => this.sendJSON( `action:${name}`, params )

  openWindow = isElectron && !isDev
    ? ( url, params ) => this.action( 'open-window', { url: `${window.location.origin}${url}`, ...params } )
    : url => window.open( url )

  openExternalUrl = isElectron
    ? url => this.action( 'open-external-url', url )
    : url => window.open( url )

  resetSettings = ( host = 'local' ) => {
    localStorage.setItem( 'settings', '{}' )
    this.setSettings( {}, host, false )
  }

  resetSettingGroup = ( group, host = 'local' ) => {
    const { [ group ]: _, ...settings } = this.settings[ host ]
    this.setSettings( settings, host, false )
  }
}

// Allow only one instance by exporting it
export default new Controller()
