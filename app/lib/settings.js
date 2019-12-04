/**
 * Loads and exports settings instance.
 * @ignore
 */

import { EventEmitter } from 'events'
import { readJSON, writeJSON, ensureFile } from 'fs-extra'
import merge from 'deepmerge'

import { SETTINGS_FILE, DEFAULT_SETTINGS_FILE } from './consts'
import logger from './logger'

/**
 * Simple class to manage application settings
 */
class Settings extends EventEmitter {
  /**
   * Initialises the Settings class.
   * Loads in the existing settings.
   */
  constructor() {
    super()
    this.settings = {}
  }

  static async readSettings( onlyOverrides ) {
    try {
      // Load settings file
      const settings = await readJSON( SETTINGS_FILE )

      // Return only changes or entire settings data
      return onlyOverrides ? settings : merge( await readJSON( DEFAULT_SETTINGS_FILE ), settings )
    } catch ( err ) {
      logger.warn( 'Settings file is corrupt or non-existent. Recreating', SETTINGS_FILE )

      await ensureFile( SETTINGS_FILE )
      await writeJSON( SETTINGS_FILE, {} )

      return onlyOverrides ? {} : readJSON( DEFAULT_SETTINGS_FILE )
    }
  }

  /**
   * Loads settings, merging them with the defaults.
   */
  async loadSettings() {
    logger.info( `Loading settings from ${SETTINGS_FILE}` )
    this.settings = await Settings.readSettings()
  }

  /**
   * Saves the settings back to disk.
   */
  async saveSettings( changed = {} ) {
    const settings = merge( await Settings.readSettings( true ), changed )
    await writeJSON( SETTINGS_FILE, settings, { spaces: 2 } )

    this.emit( 'change', this.settings )
  }

  /**
   * Returns all settings if no parameters, else the path provided.
   * @param {string} path The setting path to deep-get.
   * @returns {*} The value at `path`.
   */
  get( path ) {
    return path
      ? path.split( '.' ).reduce( ( settings, key ) => settings[ key ], this.settings )
      : this.settings
  }

  /**
   * Sets a key-value pair and saves.
   * @param {string} key The key to set the value for.
   * @param {*} value The new value of the key.
   */
  set( key, value ) {
    this.settings[ key ] = value
    this.saveSettings( { [ key ]: value } )
  }

  /**
   * Merges a given settings object with the current settings and saves.
   * @param {Object} settings The settings object to merge with.
   */
  merge( settings = {} ) {
    this.settings = merge( this.settings, settings )
    this.saveSettings( settings )
  }
}

// Export the instance
export default new Settings()
