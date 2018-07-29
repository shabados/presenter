/**
 * Constants file.
 * @ignore
 */
import { join } from 'path'

import { getAppDataPath } from 'appdata-path'

// Check every 1 minute
export const UPDATE_CHECK_INTERVAL = 1000 * 60

// File locations
export const DATA_FOLDER = join( getAppDataPath( ), 'Shabad OS' )
export const SETTINGS_FILE = join( DATA_FOLDER, 'settings.json' )
export const DEFAULT_SETTINGS_FILE = `${__dirname}/../settings.default.json`

// Temporary files directory
export const TEMP_DIR = './tmp'

// Max Search results to return in one go
export const MAX_RESULTS = 20

// Backend port
export const PORT = process.env.NODE_ENV === 'production' ? 42424 : 8080
