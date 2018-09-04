/**
 * Session management and synchronisation.
 * @ignore
 */

import logger from './logger'
import settingsManager from './settings'
import History from './History'
import { getShabad, getBaniLines } from './db'

/**
 * Handles synchronisation of all the sessions.
 */
class SessionManager {
  constructor( socket ) {
    // Store the socket
    this.socket = socket

    // Setup the session's default state
    this.session = {
      bani: null,
      lineId: null,
      shabad: null,
      viewedLines: new Set(),
      mainLineId: null,
      history: new History( ),
      settings: new Map(),
    }

    // Send all the current data on connection from a new client
    socket.on( 'connection', this.synchronise.bind( this ) )

    // Update the state if on receiving data from the client
    socket.on( 'shabad', this.onShabad.bind( this ) )
    socket.on( 'line', this.onLine.bind( this ) )
    socket.on( 'mainLine', this.onMainLine.bind( this ) )
    socket.on( 'clearHistory', this.onClearHistory.bind( this ) )
    socket.on( 'bani', this.onBani.bind( this ) )
  }

  /**
   * Synchronises a client with the current state.
   * @param client The client to synchronise the state to.
   */
  synchronise( client ) {
    const { bani, mainLineId, viewedLines, lineId, shabad, history } = this.session

    client.sendJSON( 'shabad', shabad )
    client.sendJSON( 'bani', bani )
    client.sendJSON( 'line', lineId )
    client.sendJSON( 'viewedLines', viewedLines )
    client.sendJSON( 'mainLine', mainLineId )
    client.sendJSON( 'history', history.getTransitionsOnly() )
  }

  /**
   * When a Shabad ID is received, fetch the Shabad and send it to all clients.
   * @param client The socket client that sent the Shabad.
   * @param shabadId The ID of the Shabad.
   * @param lineId The optional line in the Shabad.
   */
  async onShabad( client, { shabadId, lineId = null } ) {
    const { history } = this.session
    logger.info( `Setting Shabad ID to ${shabadId}` )

    const shabad = await getShabad( shabadId )
    this.session = {
      ...this.session,
      shabad,
      lineId,
      bani: null,
      viewedLines: new Set(),
      mainLineId: null,
    }

    this.socket.broadcast( 'shabad', shabad )
    this.onLine( client, lineId, true )

    // Rebroadcast history
    this.socket.broadcast( 'history', history.getTransitionsOnly() )
  }

  /**
   * When a line id is received, send it to all clients.
   * @param client The socket client that sent the line id.
   * @param lineId The ID of the line.
   * @param transition Whether or not the line change is also a Shabad change.
   */
  onLine( client, lineId, transition = false ) {
    const { viewedLines, bani, shabad, history } = this.session
    logger.info( `Setting Line ID to ${lineId}` )

    viewedLines.add( lineId )

    const { lines } = shabad || bani
    this.session = { ...this.session, lineId }

    this.socket.broadcast( 'line', lineId )
    this.socket.broadcast( 'viewedLines', [ ...viewedLines ] )

    // Update and save history
    const line = lines.find( ( { id } ) => lineId === id )
    const isTransition = transition || lineId === null
    history.update( { line }, isTransition )
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
    const { history } = this.session
    logger.info( 'Clearing history' )

    history.reset()
    this.socket.broadcast( 'history', history.getTransitionsOnly() )
  }

  /**
   * When a Bani ID is received, fetch the Bani and send it to all clients.
   * @param client The socket client that sent the Bani.
   * @param shabadId The ID of the Bani.
   */
  async onBani( client, baniId ) {
    const { history } = this.session
    logger.info( `Setting the Bani ID to ${baniId}` )

    const bani = await getBaniLines( baniId )
    // Get first line ID of the Bani
    const { lines: [ firstLine ] } = bani
    const { id } = firstLine

    this.session = {
      ...this.session,
      bani,
      shabad: null,
      viewedLines: new Set(),
    }

    this.socket.broadcast( 'bani', bani )
    this.onLine( client, id, true )

    // Rebroadcast history
    this.socket.broadcast( 'history', history.getTransitionsOnly() )
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
