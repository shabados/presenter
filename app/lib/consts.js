/**
 * Constants file.
 * @ignore
 */
import { join } from 'path'
import { getAppDataPath } from 'appdata-path'

import { getDateFilename } from './utils'

// Check every 5 minutes
export const UPDATE_CHECK_INTERVAL = 1000 * 60

// Folder locations
export const DATA_FOLDER = join( getAppDataPath(), 'Shabad OS' )
export const CUSTOM_THEMES_FOLDER = join( DATA_FOLDER, 'themes' )
export const HISTORY_FOLDER = join( DATA_FOLDER, 'history' )
export const TMP_FOLDER = join( DATA_FOLDER, 'temp' )

// File locations
export const HISTORY_FILE = join( HISTORY_FOLDER, `${getDateFilename( new Date() )}.csv` )
export const SETTINGS_FILE = join( DATA_FOLDER, 'settings.json' )
export const DEFAULT_SETTINGS_FILE = `${__dirname}/../settings.default.json`

// Temporary files directory
export const TEMP_DIR = 'tmp'

// Max Search results to return in one go
export const MAX_RESULTS = 20

// Backend port
export const PORT = process.env.NODE_ENV === 'production' ? 42424 : 42425
