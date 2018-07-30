/**
 * Session management and synchronisation.
 * @ignore
 */

import logger from './logger'
import settingsManager from './settings'
import { getShabad } from './db'

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
      viewedLines: new Set(),
      mainLineId: null,
      history: [],
    }

    // Send all the current data on connection from a new client
    socket.on( 'connection', this.synchronise.bind( this ) )

    // Update the state if on receiving data from the client
    socket.on( 'shabad', this.onShabad.bind( this ) )
    socket.on( 'line', this.onLine.bind( this ) )
    socket.on( 'mainLine', this.onMainLine.bind( this ) )
    socket.on( 'clearHistory', this.onClearHistory.bind( this ) )
  }

  /**
   * Synchronises a client with the current state.
   * @param client The client to synchronise the state to.
   */
  synchronise( client ) {
    const { baniId, history, mainLineId, viewedLines, lineId, shabad } = this.session

    client.sendJSON( 'shabad', shabad )
    client.sendJSON( 'bani', baniId )
    client.sendJSON( 'line', lineId )
    client.sendJSON( 'viewedLines', viewedLines )
    client.sendJSON( 'mainLine', mainLineId )
    client.sendJSON( 'history', history )
  }

  /**
   * When a Shabad ID is received, fetch the Shabad and send it to all clients.
   * @param client The socket client that sent the Shabad.
   * @param shabadId The ID of the Shabad.
   * @param lineId The optional line in the Shabad.
   */
  async onShabad( client, { shabadId, lineId = null } ) {
    logger.info( `Setting Shabad ID to ${shabadId}` )

    const shabad = await getShabad( shabadId )
    this.session = {
      ...this.session,
      shabad,
      lineId,
      viewedLines: new Set(),
      mainLineId: null,
      history: [
        ...this.session.history,
        {
          timestamp: new Date(),
          line: shabad.lines.find( ( { id } ) => lineId === id ),
        },
      ],
    }

    this.socket.broadcast( 'shabad', shabad )
    this.socket.broadcast( 'history', this.session.history )
    this.onLine( client, lineId )
  }

  /**
   * When a line id is received, send it to all clients.
   * @param client The socket client that sent the line id.
   * @param lineId The ID of the line.
   */
  onLine( client, lineId ) {
    const { viewedLines } = this.session
    logger.info( `Setting Line ID to ${lineId}` )

    viewedLines.add( lineId )
    this.session = { ...this.session, lineId }

    this.socket.broadcast( 'line', lineId )
    this.socket.broadcast( 'viewedLines', [ ...viewedLines ] )
  }

  /**
   * When the main line has been set by a client, send it to all clients.
   * @param client The socket client that sent the line id.
   * @param mainLineId The ID of the user defined main line in the Shabad.
   */
  onMainLine( client, mainLineId ) {
    logger.info( `Setting the main Line ID to ${mainLineId}` )

    this.socket.broadcast( 'mainLine', mainLineId )
    this.session = { ...this.session, mainLineId }
  }

  /**
   * Clear the session history.
   */
  onClearHistory() {
    logger.info( 'Clearing history' )

    const history = []
    this.session = { ...this.session, history }
    this.socket.broadcast( 'history', history )
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
