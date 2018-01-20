/**
 * Session management and synchronisation.
 * @ignore
 */

import settingsManager from './settings'

/**
 * Handles synchronisation of all the sessions.
 */
class SessionManager {
  constructor( socketServer ) {
    // Setup the session's default state
    this.session = {
      baniId: null,
      shabadId: null,
      lineId: null,
    }

    // Set any new connection's messages to set the state
    socketServer.onConnection( client => {
      // Send the current session to the new client
      client.sendJSON( this.get() )

      // Sets the session's state if a client sends it through
      const onMessage = data => this.set( data )
      return onMessage
    } )
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
