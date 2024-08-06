import { join, resolve } from 'node:path'

import { isProduction } from '@presenter/node'

// Check every 5 minutes
export const UPDATE_CHECK_INTERVAL = 5000 * 60

// App folder locations
export const APP_FOLDER = resolve( '@shabados/presenter' )
export const FRONTEND_FOLDER = resolve( '@presenter/frontend' )
export const FRONTEND_SRC_FOLDER = join( FRONTEND_FOLDER, 'src' )
export const FRONTEND_BUILD_FOLDER = join( FRONTEND_FOLDER, 'dist' )
export const FRONTEND_OVERLAY_THEMES_FOLDER = join( FRONTEND_SRC_FOLDER, 'overlay', 'themes' )
export const FRONTEND_THEMES_FOLDER = join( FRONTEND_SRC_FOLDER, 'Presenter', 'themes' )
export const DATABASE_FOLDER = resolve( '@shabados/database' )

// Max Search results to return in one go
export const MAX_RESULTS = 50

// Backend port
export const PORT = isProduction ? 1699 : 42425
