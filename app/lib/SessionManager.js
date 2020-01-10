/**
 * Session management and synchronisation.
 * @ignore
 */

import get from 'get-value'
import merge from 'deepmerge'
import { clamp } from 'lodash'

import logger from './logger'
import settingsManager from './settings'
import History from './History'
import { getShabad, getBaniLines, getShabadByOrderId, getShabadRange } from './db'

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
      viewedLines: {},
      mainLineId: null,
      nextLineId: null,
      history: new History(),
      settings: {},
      status: null,
    }

    // Send all the current data on connection from a new client
    socket.on( 'connection', this.onConnection.bind( this ) )

    // Remove data from caches on disconnection
    socket.on( 'disconnection', this.onDisconnection.bind( this ) )

    // Update the state if on receiving data from the client
    socket.on( 'shabads:current', this.onShabad.bind( this ) )
    socket.on( 'lines:current', this.onLine.bind( this ) )
    socket.on( 'lines:main', this.onMainLine.bind( this ) )
    socket.on( 'lines:next', this.onNextLine.bind( this ) )
    socket.on( 'history:clear', this.onClearHistory.bind( this ) )
    socket.on( 'banis:current', this.onBani.bind( this ) )
    socket.on( 'settings:all', this.onSettings.bind( this ) )
  }

  /**
   * Synchronises a client with the current state.
   * @param {WebSocket} client The client to synchronise the state to.
   */
  onConnection( client ) {
    if ( settingsManager.get( 'notifications.connectionEvents' ) ) this.notify( `${client.host} connected`, 1000 * 3 )

    const {
      bani,
      mainLineId,
      nextLineId,
      viewedLines,
      lineId,
      shabad,
      history,
      status,
    } = this.session

    if ( bani ) client.sendJSON( 'banis:current', bani )
    else client.sendJSON( 'shabads:current', shabad )
    client.sendJSON( 'lines:current', lineId )
    client.sendJSON( 'history:viewed-lines', viewedLines )
    client.sendJSON( 'lines:main', mainLineId )
    client.sendJSON( 'lines:next', nextLineId )
    client.sendJSON( 'status', status )
    client.sendJSON( 'history:transitions', history.getTransitionsOnly() )
    client.sendJSON( 'history:latest-lines', history.getLatestLines() )
    client.sendJSON( 'settings:all', this.getClientSettings( client, this.getPublicSettings() ) )
  }

  /**
   * Deletes the settings entries for a given host.
   * @param {string} host The hostname/IP address of the settings to remove.
   */
  onDisconnection( { host } ) {
    if ( settingsManager.get( 'notifications.disconnectionEvents' ) ) this.notify( `${host} disconnected`, 1000 * 3 )

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
  async onShabad( client, { shabadId, shabadOrderId = null, ...rest } ) {
    const { history } = this.session

    // Clamp Shabad order IDs that exceed the limit, if specified
    const shabadOrderIdRange = await getShabadRange()
    const clampedShabadOrderId = clamp( shabadOrderId, ...shabadOrderIdRange ) || null

    // Get Shabad by order ID if specified
    const shabad = shabadOrderId
      ? await getShabadByOrderId( clampedShabadOrderId )
      : await getShabad( shabadId )

    logger.info( `Setting Shabad ID to ${shabad.id}` )

    this.session = {
      ...this.session,
      shabad,
      bani: null,
      viewedLines: history.getViewedLinesFor( shabad.id ),
      mainLineId: null,
      nextLineId: null,
    }

    this.socket.broadcast( 'shabads:current', shabad )

    this.onLine( client, rest, true )

    // Rebroadcast history
    this.socket.broadcast( 'history:transitions', history.getTransitionsOnly() )
    this.socket.broadcast( 'history:latest-lines', history.getLatestLines() )
  }

  /**
   * When a line id is received, send it to all clients.
   * @param {WebSocket} client The socket client that sent the line id.
   * @param {string} lineId The ID of the line.
   * @param {boolean} transition Whether or not the line change is also a Shabad change.
   */
  onLine( client, { lineId, lineOrderId }, transition = false ) {
    const { bani, shabad, history } = this.session

    const content = shabad || bani
    if ( !content ) return

    // Clamp line order IDs that exceed the Shabad's range of lines, if specified
    //! Invalid order IDs are possible in Banis, since the lines are not always continguous
    const lineOrderIdRange = [
      content.lines[ 0 ],
      content.lines[ content.lines.length - 1 ],
    ].map( ( { orderId } ) => orderId )
    const clampedLineOrderId = clamp( lineOrderId, ...lineOrderIdRange ) || null

    // Get the line id, or find the line id from the order id, or assume none was provided
    const newLineId = lineId
      || ( content.lines.find( ( { orderId } ) => orderId === clampedLineOrderId ) || {} ).id
      || null

    logger.info( `Setting Line ID to ${newLineId}` )

    const viewedLines = {
      ...this.session.viewedLines,
      ...( newLineId && { [ newLineId ]: new Date() } ),
    }

    const { lines = [] } = shabad || bani || {}
    this.session = { ...this.session, lineId: newLineId, viewedLines }

    this.socket.broadcast( 'lines:current', newLineId )
    this.socket.broadcast( 'history:viewed-lines', viewedLines )

    // Set the main line and calculate next line if transition
    if ( transition && shabad ) {
      // Try to use previous history values
      const { mainLineId, nextLineId: prevNextLineId } = history.getLatestFor( shabad.id ) || {}

      this.onMainLine( client, mainLineId || newLineId )

      // Next line is either first line, or line after
      const { id: nextLineId } = lines[ 0 ] === newLineId ? lines[ 1 ] : lines[ 0 ]
      this.onNextLine( client, prevNextLineId || nextLineId )
    }

    // Set the main and next line to nothing if a bani
    if ( transition && bani ) {
      this.onMainLine( client, null )
      this.onNextLine( client, null )
    }

    // Update and save history
    const line = lines.find( ( { id } ) => newLineId === id )
    const isTransition = transition || newLineId === null

    const { mainLineId, nextLineId } = this.session
    history.update( { line, bani, shabad, mainLineId, nextLineId }, isTransition )

    // Update the latest lines
    this.socket.broadcast( 'history:latest-lines', history.getLatestLines() )
  }

  /**
   * When the main line has been set by a client, send it to all clients.
   * @param {WebSocket} client The socket client that sent the line id.
   * @param {string} mainLineId The ID of the user defined main line in the Shabad.
   */
  onMainLine( client, mainLineId ) {
    const { shabad, bani } = this.session

    const { lines = [] } = shabad || bani || {}

    // Don't bother when there's no lines
    if ( !lines ) return

    logger.info( 'Setting mainLineId to', mainLineId )

    this.session = { ...this.session, mainLineId }
    this.socket.broadcast( 'lines:main', mainLineId )
  }

  /**
   * When the next jump line has been set by a client, send it to all clients.
   * @param {WebSocket} client The socket client that sent the line id.
   * @param {string} mainLineId The ID of the next jump line in the Shabad.
   */
  onNextLine( client, nextLineId ) {
    const { shabad, bani } = this.session

    const { lines = [] } = shabad || bani || {}

    // Don't bother when there's no lines
    if ( !lines ) return

    logger.info( 'Setting nextLineId to', nextLineId )

    this.session = { ...this.session, nextLineId }
    this.socket.broadcast( 'lines:next', nextLineId )
  }

  /**
   * Clear the session history.
   */
  onClearHistory() {
    const { history } = this.session
    logger.info( 'Clearing history' )

    history.reset()
    this.socket.broadcast( 'history:transitions', history.getTransitionsOnly() )
    this.socket.broadcast( 'history:latest-lines', history.getLatestLines() )
  }

  /**
   * When a Bani ID is received, fetch the Bani and send it to all clients.
   * @param {WebSocket} client The socket client that sent the Bani.
   * @param {string} baniId The ID of the Bani.
   */
  async onBani( client, { baniId, lineId = null } ) {
    const { history } = this.session
    logger.info( `Setting the Bani ID to ${baniId}` )

    const bani = await getBaniLines( baniId )

    // Get first line ID of the Bani
    const { lines: [ firstLine ] } = bani
    const id = lineId || firstLine.id

    this.session = {
      ...this.session,
      bani,
      shabad: null,
      viewedLines: history.getViewedLinesFor( bani.id ),
    }

    this.socket.broadcast( 'banis:current', bani )

    // Use last line navigated to of shabad, if exists
    const { line } = history.getLatestFor( bani.id ) || {}
    this.onLine( client, { lineId: line ? line.id : id }, true )

    // Rebroadcast history
    this.socket.broadcast( 'history:transitions', history.getTransitionsOnly() )
  }

  getClientSettings( client, publicSettings ) {
    const { host } = client

    return {
      ...publicSettings,
      [ host ]: undefined, // Remove entry for own host
      local: this.session.settings[ host ], // Map host settings to `local` field
      global: settingsManager.get(), // Map server settings to `global field
    }
  }

  /**
   * Sets the settings for a given client.
   * ! This will not work for any clients that have the hostnames of `local` or `global`.
   * @param {WebSocket} client The socket client that sent the settings update.
   */
  onSettings( client, { local = {}, global = {}, ...rest } ) {
    const { host } = client

    // Save global server settings
    settingsManager.merge( global )

    // Save new settings, mapping the local field back to the correct host
    const { settings } = this.session
    this.session = {
      ...this.session,
      settings: merge.all( [
        settings,
        rest,
        { [ host ]: local },
      ], { arrayMerge: ( _, source ) => source } ),
    }

    // Strip out private settings
    const publicSettings = this.getPublicSettings()

    // Rebroadcast all settings, transforming fields appropriately
    this.socket.forEach( client => client.sendJSON( 'settings:all', this.getClientSettings( client, publicSettings ) ) )
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
   * Sets the status provided by the backend for a certain limit.
   * @param {string} status The status of the application.
   * @param {number} duration The length to display the message.
   */
  notify( message, duration = 1000 * 30 ) {
    this.setStatus( message )
    setTimeout( () => this.setStatus(), duration )
  }

  /**
   * Sets the status provided by the backend.
   * @param {string} status The status of the application.
   */
  setStatus( status = null ) {
    this.session = { ...this.session, status }

    this.socket.broadcast( 'status', status )
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
