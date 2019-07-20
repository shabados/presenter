/**
 * Simple EventEmitter-based controller.
 * @ignore
 */

import ReconnectingWebSocket from 'reconnecting-websocket'
import EventEmitter from 'event-emitter'
import { toAscii } from 'gurmukhi-utils'

import { merge } from './utils'
import { WS_URL, DEFAULT_OPTIONS } from './consts'

class Controller extends EventEmitter {
  constructor() {
    super()

    // Setup WebSocket connection to server
    this.socket = new ReconnectingWebSocket( WS_URL )
    this.socket.addEventListener( 'open', this.onOpen )
    this.socket.addEventListener( 'close', this.onClose )
    this.socket.addEventListener( 'message', this.onMessage )
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
    this.setSettings()
    this.emit( 'connected' )
  }

  /**
   * Called when the WebSocket is disconnected.
   * @private
   */
  onClose = () => {
    console.log( 'Disconnected from server' )
    this.emit( 'connected' )
  }

  /**
   * Called when the WebSocket receives a message.
   * @param data The data sent by the server.
   */
  onMessage = ( { data } ) => {
    const { event, payload } = JSON.parse( data )
    this.emit( event, payload )
  }

  /**
   * Convenience method for searching.
   * @param firstLetters The first letters to search with.
   */
  search = firstLetters => this.sendJSON( 'search', toAscii( firstLetters ) )

  /**
   * Convenience method for setting the line.
   * @param lineId The line id to change the display to.
   */
  line = lineId => this.sendJSON( 'line', { lineId } )

  previousLine = lineId => this.sendJSON( 'line', { lineOrderId: lineId - 1 } )

  nextLine = lineId => this.sendJSON( 'line', { lineOrderId: lineId + 1 } )

  /**
   * Convenience method for setting the main line.
   * @param lineId The line id to change the display to.
   */
  mainLine = lineId => this.sendJSON( 'mainLine', lineId )

  /**
   * Convenience method for setting the current shabad.
   * @param shabadId The shabad ID to change the server to.
   * @param lineId The line id to change the display to.
   */
  shabad = ( { shabadId, shabadOrderId = null, lineId = null, lineOrderId = null } ) =>
    this.sendJSON( 'shabad', { shabadId, shabadOrderId, lineId, lineOrderId } )

  previousShabad = ( orderId, setLine = true ) => this.shabad( {
    shabadOrderId: orderId - 1,
    lineOrderId: setLine ? 1e20 : null,
  } )

  nextShabad = ( orderId, setLine = true ) => this.shabad( {
    shabadOrderId: orderId + 1,
    lineOrderId: setLine ? 0 : null,
  } )

  /**
   * Convenience method for clearing the line.
   */
  clear = () => this.sendJSON( 'line', null )

  /**
   * Clears the current history for the session.
   */
  clearHistory = () => this.sendJSON( 'clearHistory' )

  /**
   * Requests the latest list of banis from the server.
   */
  getBanis = () => this.sendJSON( 'banis' )

  /**
   * Sets the current Bani ID.
   * @param baniId The ID of the Bani to change to.
   */
  bani = baniId => this.sendJSON( 'bani', baniId )

  /**
   * Reads the settings from local storage, and combines with default settings.
   */
  readSettings = () => {
    try {
      const localSettings = JSON.parse( localStorage.getItem( 'settings' ) )
      return merge( DEFAULT_OPTIONS.local, localSettings )
    } catch ( err ) {
      console.warn( 'Settings corrupted. Resetting to default.', err )
      return DEFAULT_OPTIONS.local
    }
  }

  /**
   * Stores any setting changes locally and submits changes to server.
   * @param changed The changed settings.
   * @param host The optional host to apply the settings to. Default of `local`.
   */
  setSettings = ( changed = {}, host = 'local' ) => {
    let settings = {}
    if ( host === 'local' ) {
      settings = { local: merge( this.readSettings(), changed ) }

      const { local } = settings
      localStorage.setItem( 'settings', JSON.stringify( local ) )
      this.emit( 'settings', settings )
    } else {
      settings = { [ host ]: changed }
    }

    this.sendJSON( 'settings', settings )
  }
}

// Allow only one instance by exporting it
export default new Controller()
