/**
 * Loads and exports settings instance.
 * @ignore
 */

import fs from 'fs'

import nconf from 'nconf'

import defaultSettings from '../settings.default'

import logger from './logger'

const SETTINGS_FILE = '../settings.json'
const DEFAULT_SETTINGS_FILE = '../settings.default.json'

logger.info( 'Loading settings' )

// // Instantiate settings if they don't exist
if ( !fs.existsSync( SETTINGS_FILE ) ) {
  fs.writeFileSync( SETTINGS_FILE, JSON.stringify( defaultSettings, null, 2 ) )
}

// Load settings with nconf, with priority on settings.json
nconf
  .file( 'settings', SETTINGS_FILE )
  .file( 'defaultSettings', DEFAULT_SETTINGS_FILE )

nconf.save()

export default nconf
