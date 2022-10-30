import { chmod, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

import { getAppDataPath } from 'appdata-path'

export const DATA_FOLDER = join( getAppDataPath(), 'Shabad OS' )
export const CUSTOM_THEMES_FOLDER = join( DATA_FOLDER, 'themes' )
export const CUSTOM_OVERLAY_THEMES_FOLDER = join( DATA_FOLDER, 'overlay' )
export const HISTORY_FOLDER = join( DATA_FOLDER, 'history' )
export const LOG_FOLDER = join( DATA_FOLDER, 'logs' )
export const TMP_FOLDER = join( DATA_FOLDER, 'temp' )
export const UPDATE_TMP_FOLDER = join( TMP_FOLDER, '@shabados', 'database' )

const REQUIRED_FOLDERS = [
  LOG_FOLDER,
  CUSTOM_THEMES_FOLDER,
  CUSTOM_OVERLAY_THEMES_FOLDER,
  HISTORY_FOLDER,
  TMP_FOLDER,
]

export const ensureFolder = ( dir: string ) => mkdir( dir, { mode: 0o2775, recursive: true } )
  .then( () => chmod( dir, '755' ) )

export const ensureAppFolders = () => ensureFolder( DATA_FOLDER )
  .then( () => Promise.all( REQUIRED_FOLDERS.map( ensureFolder ) ) )

const dateName = ( new Date() ).toISOString().replace( /T/, '_' ).replace( /:/g, '-' )
export const { LOG_FILE = join( LOG_FOLDER, `${dateName}.log` ) } = process.env
export const HISTORY_FILE = join( HISTORY_FOLDER, `${dateName}.csv` )
export const SETTINGS_FILE = join( DATA_FOLDER, 'settings.json' )
