/**
 * Constants file.
 * @ignore
 */
import { join } from 'path'
import { platform } from 'os'
import { getAppDataPath } from 'appdata-path'

// Dev environment
export const isDev = process.env.NODE_ENV !== 'production'

// Electron environment
export const electronVersion = process.versions.electron

// OS
export const isWindows = platform() === 'win32'
export const isMac = platform() === 'darwin'

// Check every 5 minutes
export const UPDATE_CHECK_INTERVAL = 5000 * 60

// App folder locations
export const APP_FOLDER = join( __dirname, '..' )
export const FRONTEND_FOLDER = join( APP_FOLDER, 'frontend' )
export const FRONTEND_SRC_FOLDER = join( FRONTEND_FOLDER, 'src' )
export const FRONTEND_BUILD_FOLDER = join( FRONTEND_FOLDER, 'build' )
export const FRONTEND_OVERLAY_THEMES_FOLDER = join( FRONTEND_SRC_FOLDER, 'overlay', 'themes' )
export const FRONTEND_THEMES_FOLDER = join( FRONTEND_SRC_FOLDER, 'Presenter', 'themes' )
export const DATABASE_FOLDER = join( APP_FOLDER, 'node_modules', '@shabados', 'database' )

// Data folder locations
export const DATA_FOLDER = join( getAppDataPath(), 'Shabad OS' )
export const CUSTOM_THEMES_FOLDER = join( DATA_FOLDER, 'themes' )
export const CUSTOM_OVERLAY_THEMES_FOLDER = join( DATA_FOLDER, 'overlay' )
export const HISTORY_FOLDER = join( DATA_FOLDER, 'history' )
export const LOG_FOLDER = join( DATA_FOLDER, 'logs' )
export const TMP_FOLDER = join( DATA_FOLDER, 'temp' )
export const UPDATE_TMP_FOLDER = join( TMP_FOLDER, '@shabados', 'database' )

// Data file locations
const dateName = ( new Date() ).toISOString().replace( /T/, '_' ).replace( /:/g, '-' )
export const { LOG_FILE = join( LOG_FOLDER, `${dateName}.log` ) } = process.env
export const HISTORY_FILE = join( HISTORY_FOLDER, `${dateName}.csv` )
export const SETTINGS_FILE = join( DATA_FOLDER, 'settings.json' )
export const DEFAULT_SETTINGS_FILE = join( APP_FOLDER, 'settings.default.json' )

// Max Search results to return in one go
export const MAX_RESULTS = 50

// Backend port
export const PORT = !isDev ? 1699 : 42425

// Sentry Data Source Name
export const SENTRY_DSN = 'https://bd6e4bbf9db44f5b8e9cb8f0eeaa950a@sentry.io/1363382'
export const SENTRY_PROJECT = 'desktop-backend'
