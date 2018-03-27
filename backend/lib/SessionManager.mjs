/**
 * Session management and synchronisation.
 * @ignore
 */

import logger from './logger.mjs'
import settingsManager from './settings'
import { getShabad } from './db.mjs'

/**
 * Handles synchronisation of all the sessions.
 */
class SessionManager {
  constructor( socket ) {
    // Store the socket
    this.socket = socket

    // Setup the session's default state
    this.session = {
      baniId: null,
      lineId: null,
      shabad: null,
    }

    // Send all the current data on connection from a new client
    socket.on( 'connection', this.synchronise.bind( this ) )

    // Update the state if on receiving data from the client
    socket.on( 'shabad', this.onShabad.bind( this ) )
    socket.on( 'line', this.onLine.bind( this ) )
  }

  /**
   * Synchronises a client with the current state.
   * @param client The client to synchronise the state to.
   */
  synchronise( client ) {
    const { baniId, lineId, shabad } = this.session

    client.sendJSON( 'shabad', shabad )
    client.sendJSON( 'line', lineId )
    client.sendJSON( 'bani', baniId )
  }

  /**
   * When a Shabad ID is received, fetch the Shabad and send it to all clients.
   * @param client The socket client that sent the Shabad.
   * @param shabadId The ID of the Shabad.
   */
  async onShabad( client, shabadId ) {
    logger.info( `Setting Shabad ID to ${shabadId}` )

    const shabad = await getShabad( shabadId )
    this.socket.broadcast( 'shabad', shabad )

    this.session = { ...this.session, shabad }
  }

  /**
   * When a line id is received, send it to all clients.
   * @param client The socket client that sent the line id.
   * @param lineId The ID of the line.
   */
  onLine( client, lineId ) {
    logger.info( `Setting Line ID to ${lineId}` )

    this.socket.broadcast( 'line', lineId )

    this.session = { ...this.session, lineId }
  }

  /**
   * Sets the state of the session, and/or settings.
   * @param data The data containing new state, and/or settings
   */
  set( data = {} ) {
    const { settings = {}, state = {} } = data

    // Save any settings
    settingsManager.merge( settings )

    // Merge in any state change
    this.session = { ...this.session, ...state }
  }

  /**
   * Gets the current state and settings.
   */
  get() {
    return { settings: settingsManager.get(), session: this.session }
  }
}

export default SessionManager
