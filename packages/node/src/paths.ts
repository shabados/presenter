import { chmod, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import getAppDataPath from 'appdata-path'

export const resolveModule = ( name: string ) => dirname( fileURLToPath(
  import.meta.resolve( name )
) )

export const DATA_FOLDER = join( getAppDataPath(), 'Shabad OS' )
export const USER_PRESENTER_THEMES_FOLDER = join( DATA_FOLDER, 'themes', 'presenter' )
export const USER_OVERLAY_THEMES_FOLDER = join( DATA_FOLDER, 'themes', 'overlay' )
export const HISTORY_FOLDER = join( DATA_FOLDER, 'history' )
export const LOG_FOLDER = join( DATA_FOLDER, 'logs' )
export const TMP_FOLDER = join( DATA_FOLDER, 'temp' )
export const UPDATE_TMP_FOLDER = join( TMP_FOLDER, '@shabados', 'database' )

const REQUIRED_FOLDERS = [
  LOG_FOLDER,
  USER_PRESENTER_THEMES_FOLDER,
  USER_OVERLAY_THEMES_FOLDER,
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
