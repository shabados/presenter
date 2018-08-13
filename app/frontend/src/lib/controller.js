/**
 * Simple EventEmitter-based controller.
 * @ignore
 */

import ReconnectingWebSocket from 'reconnecting-websocket'
import EventEmitter from 'event-emitter'

import { WS_URL } from './consts'

class Controller extends EventEmitter {
  constructor() {
    super()

    // Setup WebSocket connection to server
    this.socket = new ReconnectingWebSocket( WS_URL )
    this.socket.addEventListener( 'open', this._onOpen )
    this.socket.addEventListener( 'close', this._onClose )
    this.socket.addEventListener( 'message', this._onMessage )
  }

  /**
   * Sends a payload with a name to the server.
   * @param event The event name.
   * @param payload The JSON data to send.
   */
  sendJSON = ( event, payload ) => this.socket.send( JSON.stringify( { event, payload } ) )

  /**
   * Called when the WebSocket is connected.
   * @private
   */
  _onOpen = () => {
    console.log( 'Connected to server' )
    this.emit( 'connected' )
  }

  /**
   * Called when the WebSocket is disconnected.
   * @private
   */
  _onClose = () => {
    console.log( 'Disconnected from server' )
    this.emit( 'connected' )
  }

  /**
   * Called when the WebSocket receives a message.
   * @param data The data sent by the server.
   */
  _onMessage = ( { data } ) => {
    const { event, payload } = JSON.parse( data )
    this.emit( event, payload )
  }

  /**
   * Convenience method for searching.
   * @param firstLetters The first letters to search with.
   */
  search = firstLetters => this.sendJSON( 'search', firstLetters )

  /**
   * Convenience method for setting the line.
   * @param lineId The line id to change the display to.
   */
  line = lineId => this.sendJSON( 'line', lineId )

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
  shabad = ( { shabadId, lineId = null } ) => this.sendJSON( 'shabad', { shabadId, lineId } )

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

  getSettings = () => this.sendJSON( 'getSettings' )
}

// Allow only one instance by exporting it
export default new Controller()
