/**
 * Loads and exports settings instance.
 * @ignore
 */

import fs from 'fs-extra'

import logger from './logger'

const { readJsonSync, writeJsonSync, existsSync } = fs

const SETTINGS_FILE = './settings.json'
const DEFAULT_SETTINGS_FILE = './settings.default.json'

/**
 * Simple class to manage application settings
 */
class Settings {
  constructor() {
    this.settings = {}

    this.loadSettings()
  }

  /**
   * Loads settings, merging them with the defaults.
   */
  loadSettings() {
    logger.info( 'Loading settings' )

    // Create settings.json if it doesn't exist
    Settings.checkCreateSettings()

    // Load both settings files
    const defaultSettings = readJsonSync( DEFAULT_SETTINGS_FILE )
    const settings = readJsonSync( SETTINGS_FILE )

    // Merge and store them
    this.settings = { ...defaultSettings, ...settings }

    // Save them for good measure
    this.saveSettings()
  }

  /**
   * Saves the settings back to disk.
   */
  saveSettings() {
    writeJsonSync( SETTINGS_FILE, this.settings, { spaces: 2 } )
  }

  /**
   * Returns all the settings.
   */
  get() {
    return this.settings
  }

  /**
   * Sets a key-value pair and saves.
   * @param key The key to set the value for
   * @param value The new value of the key
   */
  set( key, value ) {
    this.settings[ key ] = value
    this.saveSettings()
  }

  /**
   * Merges a given settings object with the current settings and saves.
   * @param settings The settings object to merge with
   */
  merge( settings ) {
    this.settings = { ...this.settings, ...settings }
    this.saveSettings()
  }

  /**
   * Creates a settings.json file if it doesn't already exist.
   */
  static checkCreateSettings() {
    if ( !existsSync( SETTINGS_FILE ) ) {
      saveJsonSync( SETTINGS_FILE, {} )
    }
  }
}

// Export the instance
export default new Settings()
