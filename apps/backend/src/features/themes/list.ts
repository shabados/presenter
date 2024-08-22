import { readdir } from 'node:fs/promises'
import { basename, extname } from 'node:path'

import { USER_OVERLAY_THEMES_FOLDER, USER_PRESENTER_THEMES_FOLDER } from '@presenter/node'

import { OVERLAY_THEMES_FOLDER, PRESENTER_THEMES_FOLDER } from '~/helpers/consts'

const listCSSFiles = ( path: string ) => readdir( path )
  .then( ( files ) => files.map( extname ).filter( ( extension ) => extension === '.css' ) )

const getThemeNames = ( folders: string[] ) => Promise
  .all( folders.map( listCSSFiles ) )
  .then( ( themeFolders ) => themeFolders.flatMap( ( themes ) => themes ) )
  .then( ( files ) => files.map( ( filename ) => basename( filename, '.css' ) ) )

export const getPresenterThemeNames = () => getThemeNames( [
  PRESENTER_THEMES_FOLDER,
  USER_PRESENTER_THEMES_FOLDER,
] )

export const getOverlayThemeNames = () => getThemeNames( [
  OVERLAY_THEMES_FOLDER,
  USER_OVERLAY_THEMES_FOLDER,
] )
