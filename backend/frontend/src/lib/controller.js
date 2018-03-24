/**
 * Simple EventEmitter-based controller.
 * @ignore
 */

import EventEmitter from 'event-emitter'

import { WS_URL } from './consts'

class Controller extends EventEmitter {
  constructor() {
    super()

    // Setup WebSocket connection to server
    this.socket = new WebSocket( WS_URL )
    this.socket.onopen = this._onOpen
    this.socket.onclose = this._onClose
    this.socket.onmessage = this._onMessage
  }

  sendJSON = ( event, payload ) => this.socket.send( JSON.stringify( { event, payload } ) )

  _onOpen = () => {
    console.log( 'Connected to server' )
    this.emit( 'connected' )
  }

  _onClose = () => {
    console.log( 'Connected to server' )
    this.emit( 'connected' )
  }


  _onMessage = ( { data } ) => {
    const { event, payload } = JSON.parse( data )
    this.emit( event, payload )
  }

  search = firstLetters => this.sendJSON( 'search', firstLetters )

}

export default new Controller()
