/**
 * Constants file.
 * @ignore
 */
import { join } from 'path'
import { getAppDataPath } from 'appdata-path'

import { getDateFilename } from './utils'

// Check every 5 minutes
export const UPDATE_CHECK_INTERVAL = 5000 * 60

// Folder locations
export const DATA_FOLDER = join( getAppDataPath(), 'Shabad OS' )
export const CUSTOM_THEMES_FOLDER = join( DATA_FOLDER, 'themes' )
export const HISTORY_FOLDER = join( DATA_FOLDER, 'history' )
export const TMP_FOLDER = join( DATA_FOLDER, 'temp' )
export const UPDATE_TMP_FOLDER = join( TMP_FOLDER, '@shabados', 'database' )

// File locations
export const HISTORY_FILE = join( HISTORY_FOLDER, `${getDateFilename( new Date() )}.csv` )
export const SETTINGS_FILE = join( DATA_FOLDER, 'settings.json' )
export const DEFAULT_SETTINGS_FILE = `${__dirname}/../settings.default.json`

// Max Search results to return in one go
export const MAX_RESULTS = 20

// Backend port
export const PORT = process.env.NODE_ENV === 'production' ? 42424 : 42425

// Sentry Data Source Name
export const SENTRY_DSN = 'https://bd6e4bbf9db44f5b8e9cb8f0eeaa950a@sentry.io/1363382'
