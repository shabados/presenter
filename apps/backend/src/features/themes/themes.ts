import { copyFile, readdir } from 'node:fs/promises'

import { getLogger, USER_OVERLAY_THEMES_FOLDER, USER_PRESENTER_THEMES_FOLDER } from '@presenter/node'
import { basename, extname, join } from 'path'

import { OVERLAY_THEMES_FOLDER, PRESENTER_THEMES_FOLDER } from '~/helpers/consts'

const logger = getLogger( 'themes' )

const listCSSFiles = ( path: string ) => readdir( path )
  .then( ( files ) => files.filter( ( path ) => extname( path ) === '.css' ) )

const getThemeNames = ( folders: string[] ) => Promise
  .all( folders.map( listCSSFiles ) )
  .then( ( themeFolders ) => themeFolders.flatMap( ( themes ) => themes ) )
  .then( ( files ) => files.map( ( filename ) => basename( filename, '.css' ) ) )

export const getPresenterThemeNames = () => getThemeNames( [
  PRESENTER_THEMES_FOLDER,
  USER_PRESENTER_THEMES_FOLDER,
] ).catch( ( e ) => {
  logger.error( e, 'Unable to get presenter theme names', e )
} )

export const getOverlayThemeNames = () => getThemeNames( [
  OVERLAY_THEMES_FOLDER,
  USER_OVERLAY_THEMES_FOLDER,
] ).catch( ( e ) => {
  logger.error( e, 'Unable to get overlay theme names' )
} )

export const copyExampleThemes = () => Promise.all( [
  [ OVERLAY_THEMES_FOLDER, USER_OVERLAY_THEMES_FOLDER ],
  [ PRESENTER_THEMES_FOLDER, USER_PRESENTER_THEMES_FOLDER ],
].map( ( [ src, dest ] ) => copyFile(
  join( src, 'Example.template' ),
  join( dest, 'Example.css' ),
) ) )
