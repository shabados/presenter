/**
 * Session management and synchronisation.
 * @ignore
 */

import get from 'get-value'

import logger from './logger'
import settingsManager from './settings'
import History from './History'
import { getShabad, getBaniLines } from './db'

/**
 * Handles synchronisation of all the sessions.
 */
class SessionManager {
  /**
   * Initialises a Session Manager.
   * Sets up initial state and registered socket events.
   * @param {WebSocket} socket The WebSocket server.
   */
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
      history: new History(),
      settings: {},
    }

    // Send all the current data on connection from a new client
    socket.on( 'connection', this.synchronise.bind( this ) )

    // Remove data from caches on disconnection
    socket.on( 'disconnection', this.clearCache.bind( this ) )

    // Update the state if on receiving data from the client
    socket.on( 'shabad', this.onShabad.bind( this ) )
    socket.on( 'line', this.onLine.bind( this ) )
    socket.on( 'mainLine', this.onMainLine.bind( this ) )
    socket.on( 'clearHistory', this.onClearHistory.bind( this ) )
    socket.on( 'bani', this.onBani.bind( this ) )
    socket.on( 'settings', this.onSettings.bind( this ) )
  }

  /**
   * Synchronises a client with the current state.
   * @param {WebSocket} client The client to synchronise the state to.
   */
  synchronise( client ) {
    const { bani, mainLineId, viewedLines, lineId, shabad, history } = this.session

    client.sendJSON( 'shabad', shabad )
    client.sendJSON( 'bani', bani )
    client.sendJSON( 'line', lineId )
    client.sendJSON( 'viewedLines', viewedLines )
    client.sendJSON( 'mainLine', mainLineId )
    client.sendJSON( 'history', history.getTransitionsOnly() )
    client.sendJSON( 'settings', this.getPublicSettings() )
  }

  /**
   * Deletes the settings entries for a given host.
   * @param {string} host The hostname/IP address of the settings to remove.
   */
  clearCache( { host } ) {
    this.session = {
      ...this.session,
      settings: {
        ...this.session.settings,
        [ host ]: undefined,
      },
    }
  }

  /**
   * When a Shabad ID is received, fetch the Shabad and send it to all clients.
   * @param {WebSocket} client The socket client that sent the Shabad.
   * @param {string} shabadId The ID of the Shabad.
   * @param {string} lineId The optional line in the Shabad.
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
   * @param {WebSocket} client The socket client that sent the line id.
   * @param {string} lineId The ID of the line.
   * @param {boolean} transition Whether or not the line change is also a Shabad change.
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
   * @param {WebSocket} client The socket client that sent the line id.
   * @param {string} mainLineId The ID of the user defined main line in the Shabad.
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
   * @param {WebSocket} client The socket client that sent the Bani.
   * @param {string} baniId The ID of the Bani.
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
   * Sets the settings for a given client.
   * ! This will not work for any clients that have the hostnames of `local` or `global`.
   * @param {WebSocket} client The socket client that sent the settings update.
   */
  onSettings( client, { local, global = {}, ...rest } ) {
    const { host } = client

    // Save global server settings
    settingsManager.merge( global )

    // Save new settings, mapping the local field back to the correct host
    const { settings } = this.session
    this.session = { ...this.session, settings: { ...settings, ...rest, [ host ]: local } }

    // Strip out private settings
    const publicSettings = this.getPublicSettings()

    // Rebroadcast all settings, transforming fields appropriately
    this.socket.forEach( client => {
      const { host } = client
      client.sendJSON( 'settings', {
        ...publicSettings,
        [ host ]: undefined, // Remove entry for own host
        local: this.session.settings[ host ], // Map host settings to `local` field
        global: settingsManager.get(), // Map server settings to `global field
      } )
    } )
  }

  /**
   * Retrieves only the public settings from the server.
   * Checks whether the [host].security.options.private value is set, else assume public.
   * @returns {Object} An object of client settings, where the private value is `false`.
   */
  getPublicSettings() {
    const { settings } = this.session

    return Object.entries( settings ).reduce( ( acc, [ host, settings ] ) => ( {
      ...acc,
      [ host ]: get( settings, 'security.options.private' ) ? undefined : settings,
    } ), {} )
  }

  /**
   * Sets the state of the session, and/or settings.
   * @param {Object} data The data containing new state, and/or settings.
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
   * @returns {Object} An object containing the current settings and session state.
   */
  get() {
    return { settings: settingsManager.get(), session: this.session }
  }
}

export default SessionManager
