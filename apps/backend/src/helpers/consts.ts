import { isProduction } from '@presenter/node'
import { join } from 'path'

// Check every 5 minutes
export const UPDATE_CHECK_INTERVAL = 5000 * 60

// App folder locations
export const APP_FOLDER = join( __dirname, '..' )
export const FRONTEND_FOLDER = join( APP_FOLDER, 'frontend' )
export const FRONTEND_SRC_FOLDER = join( FRONTEND_FOLDER, 'src' )
export const FRONTEND_BUILD_FOLDER = join( FRONTEND_FOLDER, 'dist' )
export const FRONTEND_OVERLAY_THEMES_FOLDER = join( FRONTEND_SRC_FOLDER, 'overlay', 'themes' )
export const FRONTEND_THEMES_FOLDER = join( FRONTEND_SRC_FOLDER, 'Presenter', 'themes' )
export const DATABASE_FOLDER = join( APP_FOLDER, 'node_modules', '@shabados', 'database' )

// Max Search results to return in one go
export const MAX_RESULTS = 50

// Backend port
export const PORT = !isProduction ? 1699 : 42425

// Sentry Data Source Name
export const SENTRY_DSN = 'https://bd6e4bbf9db44f5b8e9cb8f0eeaa950a@sentry.io/1363382'
export const SENTRY_PROJECT = 'desktop-backend'
